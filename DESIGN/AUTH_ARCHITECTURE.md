# 🔐 Role-Based Authentication Architecture

## Overview

Project X implements a **unified authentication system** with **role-based access control (RBAC)** that provides separate login pages and dashboards for patients and doctors while using the same underlying authentication infrastructure.

---

## 🎯 Authentication Flow

### High-Level Flow

```mermaid
graph TD
    A[User visits app] --> B{Authenticated?}
    B -->|No| C[Redirect to /login]
    C --> D[Choose Login Type]
    D --> E[/login/patient]
    D --> F[/login/doctor]
    E --> G[Submit Credentials]
    F --> G
    G --> H[Backend Auth API]
    H --> I{Valid?}
    I -->|Yes| J[Store Token + User]
    I -->|No| K[Show Error]
    J --> L{Check Role}
    L -->|patient| M[/dashboard/patient]
    L -->|doctor| N[/dashboard/doctor]
    B -->|Yes| L
```

### Login Pages

**Two separate login pages** for better UX and branding:

| Route | Purpose | Redirect After Login |
|-------|---------|---------------------|
| `/login/patient` | Patient login | `/dashboard/patient` |
| `/login/doctor` | Doctor login | `/dashboard/doctor` |

Both pages:
- Connect to the same backend `/api/auth/login` endpoint
- Use the same `AuthContext` for state management
- Store JWT token + user data in `localStorage`
- Support auto-redirect if already authenticated

---

## 🏗️ Architecture Components

### 1. **Backend Authentication** (`backend-core/src/auth/`)

The NestJS backend provides:

```typescript
// auth.controller.ts
@Controller('auth')
export class AuthController {
  @Post('register')  // Create new user account
  async register(@Body() createUserDto: CreateUserDto)
  
  @Post('login')     // Authenticate user
  @UseGuards(LocalAuthGuard)
  async login(@Request() req)
  
  @Get('profile')    // Get current user
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req)
}
```

**Login Response Format:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "patient",  // or "doctor"
    "fullName": "John Doe"
  }
}
```

### 2. **Frontend Auth Context** (`src/context/AuthContext.jsx`)

Centralized authentication state management:

```javascript
const AuthContext = createContext({
  user: null,           // Current user object { id, email, role, fullName }
  token: null,          // JWT access token
  isAuthenticated: false,
  loading: true,       // Initial load state
  login: (token, user) => {},
  logout: () => {}
});
```

**Key Features:**
- ✅ Persists auth state in `localStorage`
- ✅ Auto-restores session on page refresh
- ✅ Provides `useAuth()` hook for components
- ✅ Handles token + user data synchronization

### 3. **Route Protection** (`src/App.jsx`)

**Protected Route Wrapper:**

```javascript
const RequireAuth = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // Wait for auth check
  if (loading) return <div>Checking access…</div>;

  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" replace />;

  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'doctor' 
      ? '/dashboard/doctor' 
      : '/dashboard/patient';
    return <Navigate to={fallback} replace />;
  }

  return children;
};
```

**Usage Example:**

```jsx
<Route
  path="/dashboard/patient"
  element={
    <RequireAuth allowedRoles={["patient"]}>
      <DashboardLayout role="patient" />
    </RequireAuth>
  }
>
  <Route index element={<PatientDashboard />} />
  <Route path="health" element={<HealthPage />} />
  <Route path="appointments" element={<AppointmentsPage />} />
  {/* ... */}
</Route>
```

---

## 🏥 Dashboard Separation

### Patient Dashboard (`/dashboard/patient`)

**Navigation Items:**
- 📊 Overview - Main dashboard with health summary
- ❤️ My Health - Vitals, health metrics, charts
- 📅 Appointments - Book/reschedule appointments
- 💬 Messages - Communication with healthcare providers
- 📄 Records - Medical records, prescriptions, lab results

**Key Features:**
- View-only access to medical records
- Book appointments from available slots
- Manage personal health information
- Access digital health card
- View treatment progress

### Doctor Dashboard (`/dashboard/doctor`)

**Navigation Items:**
- 🏢 Workspace - Main dashboard with daily overview
- 👥 Patients - Patient roster and details
- 🧠 AI Assistant - Diagnostic support tool
- 📅 Schedule - Calendar with private scheduling
- 💬 Consults - Internal communication

**Key Features:**
- Full access to patient medical records (authorized only)
- Write clinical notes and prescriptions
- Order lab tests and review results
- AI-powered diagnostic insights
- Private calendar management

---

## 🔒 Security Implementation

### Role-Based Access Control (RBAC)

**Frontend Protection:**
```javascript
// Prevents UI from rendering unauthorized content
<RequireAuth allowedRoles={["doctor"]}>
  <WriteNotePage />
</RequireAuth>
```

**Backend Protection:**
```typescript
// Double-checks permissions before returning data
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('doctor')
@Get('patient/:id/records')
getPatientRecords(@Param('id') id: string, @Request() req)
```

### Data Isolation

| User Role | Access Level | Restrictions |
|-----------|--------------|--------------|
| **Patient** | Own records only | Cannot access other patients' data |
| **Doctor** | Authorized patients | Only patients under their care |
| **Admin** | System-wide | Full access (for platform management) |

### Security Best Practices ✅

- **JWT Tokens**: Secure, stateless authentication
- **HTTPS/TLS 1.3**: Encrypted data transmission
- **Role Validation**: Frontend + Backend dual-check
- **Token Expiration**: Automatic session timeout
- **CORS Protection**: Restricted API access
- **Input Validation**: Sanitized user inputs
- **HIPAA Compliance**: Encrypted storage (AES-256)

---

## 🔄 Complete User Flows

### Patient Login Flow

1. User visits `https://app.projectx.com/login/patient`
2. Enters email + password + MFA code (if enabled)
3. Frontend calls `POST /api/auth/login` with credentials
4. Backend validates credentials, returns JWT + user object
5. Frontend stores token in `localStorage` via `AuthContext`
6. User redirected to `/dashboard/patient`
7. Can now access patient-specific pages and features

### Doctor Login Flow

1. User visits `https://app.projectx.com/login/doctor`
2. Enters email + password + MFA code (if enabled)
3. Frontend calls `POST /api/auth/login` with credentials
4. Backend validates credentials, returns JWT + user object
5. Frontend stores token in `localStorage` via `AuthContext`
6. User redirected to `/dashboard/doctor`
7. Can now access doctor-specific tools and patient data

### Unauthorized Access Attempt

```javascript
// Patient tries to access doctor page
User at: /dashboard/patient
Clicks link to: /dashboard/doctor/ai

// RequireAuth component checks
user.role === "patient"
allowedRoles === ["doctor"]
user.role NOT in allowedRoles

// Automatic redirect
Navigate to: /dashboard/patient
```

---

## 📁 File Structure

```
Project-X/
├── backend-core/
│   └── src/
│       └── auth/
│           ├── auth.controller.ts    # Login/register endpoints
│           ├── auth.service.ts       # Business logic
│           ├── jwt.strategy.ts       # JWT validation
│           └── guards/
│               ├── local-auth.guard.ts
│               └── jwt-auth.guard.ts
│
└── src/
    ├── context/
    │   └── AuthContext.jsx          # Global auth state
    │
    ├── pages/
    │   ├── auth/
    │   │   ├── LoginPage.jsx        # Handles both patient/doctor login
    │   │   └── SignupPage.jsx
    │   │
    │   └── dashboard/
    │       ├── PatientDashboard.jsx
    │       ├── DoctorDashboard.jsx
    │       ├── patient/             # Patient-only pages
    │       │   ├── HealthPage.jsx
    │       │   ├── AppointmentsPage.jsx
    │       │   └── RecordsPage.jsx
    │       │
    │       └── doctor/              # Doctor-only pages
    │           ├── PatientsPage.jsx
    │           ├── AIPage.jsx
    │           └── SchedulePage.jsx
    │
    ├── components/
    │   └── layout/
    │       └── DashboardLayout.jsx  # Role-aware sidebar/header
    │
    └── App.jsx                      # Route configuration
```

---

## 🛠️ Implementation Examples

### Making Authenticated API Calls

```javascript
import { useAuth } from '../context/AuthContext';

function HealthPage() {
  const { token } = useAuth();

  useEffect(() => {
    fetch('/api/patient/vitals', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setVitals(data));
  }, [token]);
}
```

### Adding New Protected Route

```javascript
// App.jsx
<Route
  path="/dashboard/patient/lab-results"
  element={
    <RequireAuth allowedRoles={["patient"]}>
      <LabResultsPage />
    </RequireAuth>
  }
/>
```

### Conditional Rendering by Role

```javascript
function DashboardLayout() {
  const { user } = useAuth();

  return (
    <aside>
      {user.role === 'patient' && (
        <NavLink to="/dashboard/patient/appointments">
          📅 Appointments
        </NavLink>
      )}
      
      {user.role === 'doctor' && (
        <NavLink to="/dashboard/doctor/patients">
          👥 Patients
        </NavLink>
      )}
    </aside>
  );
}
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Backend (.env)
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=24h
DATABASE_URL=postgresql://user:pass@localhost:5432/projectx

ENCRYPTION_KEY=use-kms-for-production
HIPAA_AUDIT_LOG=true
```

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

---

## 🚀 Next Steps

### Planned Enhancements

- [ ] **MFA (Multi-Factor Authentication)** via SMS/Email/Authenticator
- [ ] **Session Management** with refresh tokens
- [ ] **Biometric Login** for mobile apps
- [ ] **SSO Integration** (Keycloak, OAuth2)
- [ ] **Audit Logging** for HIPAA compliance
- [ ] **Role Hierarchy** (admin, nurse, specialist roles)
- [ ] **Permission System** (granular beyond just roles)

---

## 📚 Related Documentation

- [HIPAA Compliance Guidelines](../docs/hipaa-compliance.md)
- [API Documentation](../docs/api-spec.md)
- [Database Schema](../docs/database-schema.md)
- [Security Best Practices](../docs/security.md)

---

## ❓ FAQ

**Q: Why separate login pages instead of one unified login?**  
A: Better UX, clearer branding, and allows role-specific onboarding flows.

**Q: Can a user have multiple roles?**  
A: Not currently, but can be extended with role arrays and permission systems.

**Q: Where is the token stored?**  
A: `localStorage` with key `access_token`. For production, consider `httpOnly` cookies for XSS protection.

**Q: What happens when the token expires?**  
A: User is redirected to login. Implement refresh tokens for seamless re-authentication.

**Q: How do I add a new role (e.g., nurse, admin)?**  
A: 
1. Update backend user model/DTOs
2. Create new dashboard route in `App.jsx`
3. Add role to `RequireAuth` checks
4. Build role-specific pages
