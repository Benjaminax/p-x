import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import { ToastProvider } from './components/ui/Toast';
import SignupPage from './pages/auth/SignupPage';
import DashboardLayout from './components/layout/DashboardLayout';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import SearchResultsPage from './pages/SearchResultsPage';
import { useAuth } from './context/AuthContext';

// Action Pages
import MeetingPage from './pages/dashboard/MeetingPage';
import NewAppointmentPage from './pages/dashboard/patient/NewAppointmentPage';
import ReschedulePage from './pages/dashboard/patient/ReschedulePage';
import ScanReviewPage from './pages/dashboard/doctor/ScanReviewPage';
import VerifyDataPage from './pages/dashboard/doctor/VerifyDataPage';
import ManageAccessPage from './pages/dashboard/patient/ManageAccessPage';
import RosterPage from './pages/dashboard/doctor/RosterPage';
import WriteNotePage from './pages/dashboard/doctor/WriteNotePage';
import OrderLabPage from './pages/dashboard/doctor/OrderLabPage';
import PrescriptionsPage from './pages/dashboard/patient/PrescriptionsPage';
import PatientDetailPage from './pages/dashboard/doctor/PatientDetailPage';
import VitalDetailsPage from './pages/dashboard/patient/VitalDetailsPage';
import DailyLogPage from './pages/dashboard/patient/DailyLogPage';
import EmergencyCardPage from './pages/dashboard/patient/EmergencyCardPage';

// Patient Pages
import HealthPage from './pages/dashboard/patient/HealthPage';
import AppointmentsPage from './pages/dashboard/patient/AppointmentsPage';
import MessagesPage from './pages/dashboard/patient/MessagesPage';
import RecordsPage from './pages/dashboard/patient/RecordsPage';

// Doctor Pages
import PatientsPage from './pages/dashboard/doctor/PatientsPage';
import AIPage from './pages/dashboard/doctor/AIPage';
import SchedulePage from './pages/dashboard/doctor/SchedulePage';
import ConsultsPage from './pages/dashboard/doctor/ConsultsPage';
import RecordViewPage from './pages/dashboard/patient/RecordViewPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AddEventPage from './pages/dashboard/doctor/AddEventPage';
import NeuroDashboard from './pages/dashboard/doctor/NeuroDashboard';

const RequireAuth = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        Checking access…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();
  const defaultHome = user?.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        Loading workspace…
      </div>
    );
  }

  return (
    <Router>
      <ToastProvider>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={<Navigate to="/login/patient" replace />}
          />
          <Route
            path="/login/patient"
            element={user ? <Navigate to={defaultHome} replace /> : <LoginPage mode="patient" />}
          />
          <Route
            path="/login/doctor"
            element={user ? <Navigate to={defaultHome} replace /> : <LoginPage mode="doctor" />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to={defaultHome} replace /> : <SignupPage />}
          />

          {/* Patient Dashboard */}
          <Route
            path="/dashboard/patient"
            element={(
              <RequireAuth allowedRoles={["patient"]}>
                <DashboardLayout role="patient" />
              </RequireAuth>
            )}
          >
            <Route index element={<PatientDashboard />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="health/log" element={<DailyLogPage />} />            <Route path="emergency-card" element={(
              <RequireAuth allowedRoles={["patient"]}>
                <EmergencyCardPage />
              </RequireAuth>
            )} />            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="records" element={<RecordsPage />} />
          </Route>

          {/* Doctor Dashboard */}
          <Route
            path="/dashboard/doctor"
            element={(
              <RequireAuth allowedRoles={["doctor"]}>
                <DashboardLayout role="doctor" />
              </RequireAuth>
            )}
          >
            <Route index element={<DoctorDashboard />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="ai" element={<AIPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="consults" element={<ConsultsPage />} />
            <Route path="neuro" element={<NeuroDashboard />} />
          </Route>

          <Route path="/search" element={<SearchResultsPage />} />

          {/* Action Pages */}
          <Route
            path="/meeting"
            element={(
              <RequireAuth>
                <MeetingPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/patient/appointments/new"
            element={(
              <RequireAuth allowedRoles={["patient"]}>
                <NewAppointmentPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/patient/appointments/reschedule"
            element={(
              <RequireAuth allowedRoles={["patient"]}>
                <ReschedulePage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/patient/prescriptions"
            element={(
              <RequireAuth allowedRoles={["patient"]}>
                <PrescriptionsPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/patient/records/view"
            element={(
              <RequireAuth allowedRoles={["patient"]}>
                <RecordViewPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/doctor/scans/:id"
            element={(
              <RequireAuth allowedRoles={["doctor"]}>
                <ScanReviewPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/doctor/verify/:id"
            element={(
              <RequireAuth allowedRoles={["doctor"]}>
                <VerifyDataPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/patient/manage-access"
            element={(
              <RequireAuth allowedRoles={["patient"]}>
                <ManageAccessPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/doctor/roster"
            element={(
              <RequireAuth allowedRoles={["doctor"]}>
                <RosterPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/doctor/write-note"
            element={(
              <RequireAuth allowedRoles={["doctor"]}>
                <WriteNotePage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/doctor/order-lab"
            element={(
              <RequireAuth allowedRoles={["doctor"]}>
                <OrderLabPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/doctor/events/new"
            element={(
              <RequireAuth allowedRoles={["doctor"]}>
                <AddEventPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/profile"
            element={(
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            )}
          />
          <Route
            path="/settings"
            element={(
              <RequireAuth>
                <SettingsPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/doctor/ai"
            element={(
              <RequireAuth allowedRoles={["doctor"]}>
                <AIPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/doctor/patients/:id"
            element={(
              <RequireAuth allowedRoles={["doctor"]}>
                <PatientDetailPage />
              </RequireAuth>
            )}
          />
          <Route
            path="/dashboard/patient/health/details"
            element={(
              <RequireAuth allowedRoles={["patient"]}>
                <VitalDetailsPage />
              </RequireAuth>
            )}
          />

          {/* Default Redirect */}
          <Route
            path="/"
            element={user ? <Navigate to={defaultHome} replace /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App;
