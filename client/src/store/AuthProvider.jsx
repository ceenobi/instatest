import { getAuthenticatedUser, logoutUser, refreshAccessToken } from "@/api";
import { useLocalStorage } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthStore } from ".";

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
    try {
      const res = await getAuthenticatedUser(accessToken);
      setUser({
        data: res.data,
        isAuthenticated: true,
        isCheckingAuth: false,
        isError: null,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        const isRefreshed = await refreshToken();
        if (isRefreshed) {
          await checkAuth();
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

  // Only run auth check on mount or when access token changes
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      if (!accessToken) {
        setUser({
          data: null,
          isError: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
        return;
      }

      setUser((prev) => ({ ...prev, isCheckingAuth: true }));
      try {
        if (mounted) {
          await checkAuth();
        }
      } catch (error) {
        if (mounted) {
          setUser({
            data: null,
            isError: error,
            isAuthenticated: false,
            isCheckingAuth: false,
          });
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]); // Only depend on accessToken changes

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

  const contextData = {
    user,
    setUser,
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
