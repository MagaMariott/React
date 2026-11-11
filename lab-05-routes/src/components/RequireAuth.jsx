import { Navigate, useLocation } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <p className="state">Checking the session…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
