import { useAuthStore } from "@/hooks";
import { Navigate } from "react-router-dom";

export const PrivateRoutes = ({ children }) => {
  const { user } = useAuthStore();
  if (!user.isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

export const PublicRoutes = ({ children }) => {
  const { user } = useAuthStore();
  if (user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};
