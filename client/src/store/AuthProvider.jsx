import { getAuthenticatedUser, logoutUser, refreshAccessToken } from "@/api";
import { useLocalStorage } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthStore } from ".";
// import { LazySpinner } from "@/components";

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage(
    "instaAccessToken",
    null
  );
  const [user, setUser] = useState({
    isError: null,
    data: null,
    isCheckingAuth: false,
    isAuthenticated: false,
  });

  const refreshToken = useCallback(async () => {
    try {
      const res = await refreshAccessToken();
      if (res.status === 200) {
        setAccessToken(res.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      // If refresh token is expired or invalid, clear auth state
      setAccessToken(null);
      setUser({
        data: null,
        isError: error,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
      return false;
    }
  }, [setAccessToken]);

  const checkAuth = useCallback(async () => {
    setUser((prev) => ({ ...prev, isError: null, isCheckingAuth: true }));
    try {
      const res = await getAuthenticatedUser(accessToken);
      setUser({
        data: res.data,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      // If access token is expired, try to refresh it
      if (error.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the auth check with new access token
          const retryRes = await getAuthenticatedUser(accessToken);
          setUser({
            data: retryRes.data,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
          return;
        }
      }
      setUser({
        data: null,
        isError: error,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    let ignore = false;

    const verifyAuth = async () => {
      try {
        if (!ignore) {
          await checkAuth();
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
      }
    };

    verifyAuth();

    return () => {
      ignore = true;
    };
  }, [checkAuth]);

  const logout = async () => {
    try {
      const res = await logoutUser();
      if (res.status === 200) {
        setAccessToken(null);
        setUser({
          data: null,
          isError: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // if (user?.isCheckingAuth) {
  //   return <LazySpinner />;
  // }

  const contextData = {
    user,
    accessToken,
    setAccessToken,
    checkAuth,
    refreshToken,
    logout,
  };

  return (
    <AuthStore.Provider value={contextData}>{children}</AuthStore.Provider>
  );
};
