import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/model/auth.store";

/** Blocks access to /chat unless a session exists. */
export function ProtectedRoute() {
  if (!useAuthStore((state) => state.isAuthenticated)) {
    return <Navigate replace to="/login" />;
  }
  return <Outlet />;
}