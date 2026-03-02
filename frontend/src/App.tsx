import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { RoleLandingRedirect } from "./components/routing/RoleLandingRedirect";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AdminOverviewPage } from "./pages/admin/AdminOverviewPage";
import { OfficerManagementPage } from "./pages/admin/OfficerManagementPage";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { SystemLogsPage } from "./pages/admin/SystemLogsPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { ViolationAnalyticsPage } from "./pages/admin/ViolationAnalyticsPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ChallanDetailsPage } from "./pages/citizen/ChallanDetailsPage";
import { CitizenOverviewPage } from "./pages/citizen/CitizenOverviewPage";
import { MyChallansPage } from "./pages/citizen/MyChallansPage";
import { MyVehiclesPage } from "./pages/citizen/MyVehiclesPage";
import { PaymentHistoryPage } from "./pages/citizen/PaymentHistoryPage";
import { PaymentPage } from "./pages/citizen/PaymentPage";
import { ProfilePage } from "./pages/citizen/ProfilePage";
import { NotFoundPage } from "./pages/common/NotFoundPage";
import { UnauthorizedPage } from "./pages/common/UnauthorizedPage";
import { DetectedViolationsQueuePage } from "./pages/officer/DetectedViolationsQueuePage";
import { OfficerOverviewPage } from "./pages/officer/OfficerOverviewPage";
import { VerificationHistoryPage } from "./pages/officer/VerificationHistoryPage";
import { ViolationReviewPage } from "./pages/officer/ViolationReviewPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<RoleLandingRedirect />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Route groups are protected by role to simulate production RBAC behavior. */}
      <Route element={<ProtectedRoute allowedRoles={["citizen"]} />}>
        <Route
          path="/citizen"
          element={
            <DashboardLayout>
              <CitizenOverviewPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/citizen/vehicles"
          element={
            <DashboardLayout>
              <MyVehiclesPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/citizen/challans"
          element={
            <DashboardLayout>
              <MyChallansPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/citizen/challans/:challanId"
          element={
            <DashboardLayout>
              <ChallanDetailsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/citizen/payment"
          element={
            <DashboardLayout>
              <PaymentPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/citizen/payment-history"
          element={
            <DashboardLayout>
              <PaymentHistoryPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/citizen/profile"
          element={
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["officer"]} />}>
        <Route
          path="/officer"
          element={
            <DashboardLayout>
              <OfficerOverviewPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/officer/queue"
          element={
            <DashboardLayout>
              <DetectedViolationsQueuePage />
            </DashboardLayout>
          }
        />
        <Route
          path="/officer/review/:detectionId"
          element={
            <DashboardLayout>
              <ViolationReviewPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/officer/history"
          element={
            <DashboardLayout>
              <VerificationHistoryPage />
            </DashboardLayout>
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route
          path="/admin"
          element={
            <DashboardLayout>
              <AdminOverviewPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/users"
          element={
            <DashboardLayout>
              <UserManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/officers"
          element={
            <DashboardLayout>
              <OfficerManagementPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <DashboardLayout>
              <ViolationAnalyticsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <DashboardLayout>
              <SystemLogsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          }
        />
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
