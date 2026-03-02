import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
