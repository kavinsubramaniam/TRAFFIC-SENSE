import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function RoleLandingRedirect() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === "citizen") return <Navigate to="/citizen" replace />;
  if (currentUser.role === "officer") return <Navigate to="/officer" replace />;
  return <Navigate to="/admin" replace />;
}
