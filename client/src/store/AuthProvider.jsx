import { getAuthenticatedUser, refreshAccessToken } from "@/api";
import { useLocalStorage } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { AuthStore } from ".";

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage(
    "instaAccessToken",
    null
  );
  const [user, setUser] = useState({
    isError: null,
    data: null,
    isCheckingAuth: true,
    isAuthenticated: false,
  });

  const refreshToken = useCallback(async () => {
    try {
      const res = await refreshAccessToken();
      if (res.status === 200) {
        setAccessToken(res.data.accessToken);
        console.log("refreshed token");
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
  console.log(user);  

  const contextData = {
    user,
    accessToken,
    setAccessToken,
    checkAuth,
    refreshToken,
  };

  return (
    <AuthStore.Provider value={contextData}>{children}</AuthStore.Provider>
  );
};
