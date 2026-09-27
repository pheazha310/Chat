import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/model/auth.store";

export function RootRedirect() {
  return (
    <Navigate
      replace
      to={useAuthStore((state) => state.isAuthenticated) ? "/chat" : "/login"}
    />
  );
}