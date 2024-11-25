import { useAuthStore } from "@/hooks";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoutes = ({ children }) => {
  const { accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken) {
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
};

export const PublicRoutes = ({ children }) => {
  const { accessToken } = useAuthStore();
  const location = useLocation();
  const from = location.state?.from || "/";
  if (accessToken) {
    return <Navigate to={from} replace />;
  }

  return children;
};
