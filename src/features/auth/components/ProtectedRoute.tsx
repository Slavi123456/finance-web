import { useAppSelector } from "../../../app/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullPageSpinner from "./FullPageSpinner";

export function ProtectedRoute() {
  const { user, status } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (status == "loading") return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
