import { useAuthStore } from "@/hooks";
import { Navigate, useLocation } from "react-router-dom";
import { LazySpinner } from "@/components";

export const PrivateRoutes = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (user?.isCheckingAuth) {
    return <LazySpinner />;
  }

  if (!user?.isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export const PublicRoutes = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const from = location.state?.from || "/";

  if (user?.isCheckingAuth) {
    return <LazySpinner />;
  }

  if (user?.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
};
