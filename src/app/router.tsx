import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage, ProtectedRoute, RegisterPage } from "../features/auth";
import AppLayout from "../components/AppLayout";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          // { path: "dashboard",
          //   //Loaded only when visited, so Recharts stays out of the first bundle
          //   lazy: async () => ({Component: ( await import("../features/analytics/DashboardPage").default )})
          // },
          // { path: "purchases",
          //   lazy: async () => ({Component: ( await import("../features/purchases/PurchasesPage").default )})
          // },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
