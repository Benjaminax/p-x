-- PROJECT X HMS core relational schema (PostgreSQL)
-- Note: Application currently runs on MongoDB. This schema is provided for planned PostgreSQL migration.

-- Enums
DO $$ BEGIN
  CREATE TYPE subscription_plan_enum AS ENUM ('basic', 'standard', 'enterprise');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM ('patient', 'doctor', 'nurse', 'admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE blood_type_enum AS ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE genotype_enum AS ENUM ('AA','AS','SS','AC','SC');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE allergy_severity_enum AS ENUM ('mild', 'moderate', 'severe', 'life-threatening');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_type_enum AS ENUM ('in-person', 'video', 'follow-up');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status_enum AS ENUM ('pending','confirmed','completed','cancelled','no-show');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE medical_record_status_enum AS ENUM ('active', 'resolved', 'chronic', 'referred');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE scan_type_enum AS ENUM ('xray','mri','ct','ultrasound','brain_scan','other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE symptom_status_enum AS ENUM ('improving','stable','worsening');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE reported_role_enum AS ENUM ('doctor','nurse','staff');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_category_enum AS ENUM ('misconduct','negligence','unprofessional','other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status_enum AS ENUM ('pending','reviewed','resolved');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE reminder_channel_enum AS ENUM ('email','sms');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  region VARCHAR(120),
  country VARCHAR(80) NOT NULL DEFAULT 'Ghana',
  phone VARCHAR(50),
  email VARCHAR(255) UNIQUE,
  subscription_plan subscription_plan_enum NOT NULL DEFAULT 'basic',
  subscription_start DATE,
  subscription_end DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password_hash TEXT NOT NULL,
  role user_role_enum NOT NULL,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS patient_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  date_of_birth DATE,
  gender gender_enum,
  blood_type blood_type_enum,
  genotype genotype_enum,
  height_cm DECIMAL(6,2),
  weight_kg DECIMAL(6,2),
  profile_photo_url TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  health_insurance_provider VARCHAR(255),
  health_insurance_number VARCHAR(255),
  insurance_card_url TEXT,
  qr_code_url TEXT,
  is_offline_sync_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS allergies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  allergen VARCHAR(255) NOT NULL,
  reaction TEXT,
  severity allergy_severity_enum NOT NULL,
  verified_by_lab BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
  first_name VARCHAR(120) NOT NULL,
  last_name VARCHAR(120) NOT NULL,
  specialisation VARCHAR(255),
  license_number VARCHAR(120) UNIQUE NOT NULL,
  bio TEXT,
  profile_photo_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS doctor_patient_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE RESTRICT,
  patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE RESTRICT,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  transferred_from_doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE RESTRICT,
  doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE RESTRICT,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  type appointment_type_enum NOT NULL,
  status appointment_status_enum NOT NULL DEFAULT 'pending',
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE RESTRICT,
  doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE RESTRICT,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
  visit_date DATE NOT NULL,
  chief_complaint TEXT,
  diagnosis TEXT,
  icd10_code VARCHAR(40),
  treatment_plan TEXT,
  follow_up_date DATE,
  status medical_record_status_enum NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS doctor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE RESTRICT,
  content TEXT NOT NULL,
  is_confidential BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE RESTRICT,
  doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE RESTRICT,
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(255) NOT NULL,
  frequency VARCHAR(255) NOT NULL,
  duration_days INT,
  instructions TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE RESTRICT,
  doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE SET NULL,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
  test_name VARCHAR(255) NOT NULL,
  test_date DATE NOT NULL,
  result_summary TEXT,
  file_url TEXT,
  is_released_to_patient BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS medical_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE RESTRICT,
  doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE RESTRICT,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
  scan_type scan_type_enum NOT NULL,
  scan_date DATE NOT NULL,
  body_part VARCHAR(120),
  file_url TEXT,
  ai_analysis_result JSONB,
  ai_analysed_at TIMESTAMPTZ,
  "3d_model_url" TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS treatment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE RESTRICT,
  medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  recorded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  date DATE NOT NULL,
  pain_score INT CHECK (pain_score >= 0 AND pain_score <= 10),
  symptom_status symptom_status_enum,
  notes TEXT,
  vitals JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medications_reminder (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  reminder_times TEXT[] NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS anonymous_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  reported_role reported_role_enum NOT NULL,
  category report_category_enum NOT NULL,
  description TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status report_status_enum NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS subscription_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  reminder_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  days_before_expiry INT NOT NULL,
  channel reminder_channel_enum NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(255) NOT NULL,
  resource_id UUID,
  ip_address VARCHAR(80),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated-at trigger helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_hospitals_updated_at BEFORE UPDATE ON hospitals FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  CREATE TRIGGER trg_patient_profiles_updated_at BEFORE UPDATE ON patient_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  CREATE TRIGGER trg_doctor_profiles_updated_at BEFORE UPDATE ON doctor_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  CREATE TRIGGER trg_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  CREATE TRIGGER trg_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  CREATE TRIGGER trg_doctor_notes_updated_at BEFORE UPDATE ON doctor_notes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_users_hospital_id ON users(hospital_id);
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_doctor_active ON doctor_patient_assignments(doctor_id, is_active);
CREATE INDEX IF NOT EXISTS idx_assignments_patient_active ON doctor_patient_assignments(patient_id, is_active);
CREATE INDEX IF NOT EXISTS idx_appointments_hospital_scheduled ON appointments(hospital_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_visit_date ON medical_records(patient_id, visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_lab_results_patient_date ON lab_results(patient_id, test_date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_scans_patient_date ON medical_scans(patient_id, scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
