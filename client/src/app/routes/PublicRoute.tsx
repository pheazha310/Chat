import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../features/auth/model/auth.store";

/** Sends signed-in users straight to the chat page. */
export function PublicRoute() {
  if (useAuthStore((state) => state.isAuthenticated)) {
    return <Navigate replace to="/chat" />;
  }
  return <Outlet />;
}