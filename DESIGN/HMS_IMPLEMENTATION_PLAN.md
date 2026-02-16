# Project X → Hospital Management System (HMS)

Purpose: apply the HMS blueprint to this codebase and guide implementation using Angular (web), Spring Boot (backend), and Python (ML), while coexisting with the current React/NestJS code during transition.

## Target Architecture
- **Frontend**: Angular (admin/clinical) + patient app (Angular + Ionic/Capacitor for offline). Keep existing React app temporarily; replace by domain slices.
- **Backend**: Spring Boot microservices (modular monolith acceptable initially) behind an API Gateway. Keep NestJS only as a facade during migration if needed.
- **ML**: Python FastAPI service for clinician-only diagnostic support and long-term summaries.
- **Infra**: PostgreSQL for transactional data; Object Storage for artifacts (labs, reports); Redis for cache/locks; Kafka/NATS/RabbitMQ for events; Keycloak/Okta/AAD for IAM.

## Services & Responsibilities
- **Identity & Access**: OAuth2/OIDC, roles: admin, clinician, nurse, billing, patient. Scopes per resource (notes, labs, schedule). MFA optional. Tenant awareness.
- **Tenant & Subscription**: plans, entitlements, status, grace. Renewal reminders at T-25/T-10/T-3/T-1 via notifications. Feature flags per tenant (lab download allowed, patient-note visibility, schedule rules).
- **Patient & Health Card**: demographics, vitals baseline, allergies, genotype markers, critical flags. Health Card snapshot (signed, minimal, cacheable for offline). Policy gate for lab downloads when billing restricts.
- **Clinical/Encounter**: encounters, orders, medications, procedures, surgeries, attending clinician linkage. Treatment progress indicators from vitals/labs/observations timelines.
- **Notes**: default private to clinicians/authorized roles. Selective share (e.g., discharge summary) via policy.
- **Scheduling**: clinician availability with blackout windows (meetings/emergencies/workload). Patients see only bookable slots. Rate-limit bookings per patient.
- **Labs & Documents**: lab requests/results, verification state, signed URLs for downloads, facility policy toggle. Object storage with lifecycle.
- **Notifications**: email/SMS/push/in-app for renewal, lab ready, appointments, meds reminders. Consumes events.
- **Audit & Compliance**: immutable audit log for PHI reads/writes; anomaly detection hooks.
- **Offline (patient)**: encrypted local store, time-bound token, cached health card + recent labs + meds + allergies; remote wipe via revocation on next sync.
- **Diagnostics ML (doctor-only)**: clinician-auth-only API; returns ranked differentials with confidence + provenance; logs for QA. Also stores hashed pointers to backup artifacts.
- **History & Summaries**: append-only ledger of treatments, durations, surgeries, encounters, labs with timestamps. Batch/stream jobs produce 6/12/24-month summaries.

## Data Model (key tables)
Tenant, User, Role, UserRole, Patient, Clinician, Subscription, Plan, FeatureFlag, ScheduleSlot, Appointment, Encounter, Note, Order, Medication, Procedure, Surgery, LabRequest, LabResult, VitalObservation, HealthCardSnapshot, Notification, AuditEvent, MLInsight, BackupArtifact.

## API Shape (Spring Boot)
- REST (future GraphQL for aggregation). Gateway enforces authZ, rate limits, tenant.
- Versioned routes per domain: /subscriptions, /patients, /clinicians, /scheduling, /encounters, /labs, /notes, /notifications, /health-card, /ml.
- Background jobs: renewal reminder scheduler; health-card snapshot refresher; ML summary pipeline.

## Events (examples)
subscription.created|renewal_due|expired, schedule.slot_blocked|released|booked, lab.result_verified, note.shared, patient.healthcard_refreshed, ml.summary_ready, audit.accessed.

## Security
- Spring Security RBAC + attribute-based checks (tenant/patient ownership). Row-level filters.
- Encrypt in transit (TLS) and at rest (DB TDE, object storage SSE). Secrets in Vault/KMS.
- PHI access audit, least-privilege service accounts. Signed URLs for artifacts.

## Offline Strategy
- Patient app caches signed health-card payload + limited recent labs/meds/allergies in encrypted SQLite/secure keystore. Sync on connectivity; enforce TTL for cached data. Support remote wipe/revocation.

## Diagnostics ML Service (Python)
- FastAPI with clinician-only token validation (introspect via IAM). Input: structured history, vitals, labs. Output: suggestions + confidence + evidence pointers. No patient-facing endpoints. Logs for QA; redact PII where possible.

## Migration & Delivery Plan
1) **Foundation**: Stand up Identity/RBAC, Tenant/Subscription service, Audit. Wire gateway.
2) **Scheduling & Visibility**: Scheduling service with blackout windows + patient-facing filtered slots.
3) **Patient/Clinical Core**: Patients, Clinicians, Encounters, Notes (private by default), Labs with verification and downloads gated by policy.
4) **Notifications & Reminders**: Renewal reminder jobs (T-25/T-10/T-3/T-1), appointment/lab notifications.
5) **Health Card & Offline**: Health-card snapshot endpoint + patient app offline cache; remote wipe.
6) **Progress Indicators**: Longitudinal vitals/labs timeline + simple trend scoring; surface in clinician UI.
7) **Diagnostics ML**: Deploy FastAPI service behind clinician-only route; log provenance; add backup artifact hashing.
8) **Hardening**: Compliance checks, DR/backup, observability (metrics/traces/logs), anomaly detection on audit events.

## Repo Impact (current structure)
- Add Angular app (e.g., `hms-web-angular/`) for admin/clinical; keep React app during transition.
- Add Spring Boot services under `services/` (e.g., `services/iam`, `services/subscriptions`, `services/patient`, `services/clinical`, `services/scheduling`, `services/labs`, `services/notifications`, `services/gateway`). Retire NestJS when parity reached or keep as adapter temporarily.
- Add Python ML service under `ml/diagnostics-service/` (FastAPI).
- Shared contracts: OpenAPI per service; client generation for Angular and mobile.

## Near-Term Tasks
- Decide IAM provider (Keycloak vs managed). Create base Spring Boot repo with security, tenant filter, audit.
- Define subscription reminder cron + channels; design feature flags per tenant.
- Design Scheduling visibility rules and API contract for bookable slots.
- Model Health Card snapshot payload and signing/TTL rules.
- Choose mobile approach (Ionic/Capacitor) for offline patient access and secure local store.
- Define event taxonomy and broker choice (Kafka/NATS/RabbitMQ).
- Stand up FastAPI skeleton with auth middleware for clinician-only diagnostics.
