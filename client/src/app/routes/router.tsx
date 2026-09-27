import { createBrowserRouter } from "react-router-dom";
import { ChatPage } from "../../pages/chat/ChatPage";
import { LoginPage } from "../../pages/login/LoginPage";
import { RegisterPage } from "../../pages/register/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";
import { RootRedirect } from "./RootRedirect";

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  {
    path: "/login",
    element: <PublicRoute />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/register",
    element: <PublicRoute />,
    children: [{ index: true, element: <RegisterPage /> }],
  },
  {
    path: "/chat",
    element: <ProtectedRoute />,
    children: [{ index: true, element: <ChatPage /> }],
  },
  { path: "*", element: <RootRedirect /> },
]);