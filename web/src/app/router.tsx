import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { DashboardPage } from "../features/mood/DashboardPage";
import { Protected } from "../components/Protected";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/app" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/app",
    element: (
      <Protected>
        <DashboardPage />
      </Protected>
    )
  }
]);

export const AppRouter = () => <RouterProvider router={router} />;
