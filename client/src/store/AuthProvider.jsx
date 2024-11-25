import { getAuthenticatedUser, logoutUser, refreshAccessToken } from "@/api";
import { useLocalStorage } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
// import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
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
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser(); // This will clear the refresh token cookie
      setAccessToken(null);
      setUser({
        data: null,
        isError: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Error during logout:", error);
      setAccessToken(null);
      setUser({
        data: null,
        isError: null,
        isAuthenticated: false,
      });
    }
  }, [setAccessToken]);

  const setupTokenRefresh = useCallback(() => {
    if (!accessToken) return;

    try {
      const decodedToken = jwtDecode(accessToken);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // Refresh token 5 minutes before it expires
      const refreshBuffer = 5 * 60 * 1000;
      const timeUntilRefresh = timeUntilExpiry - refreshBuffer;

      if (timeUntilRefresh <= 0) {
        // Token is expired or about to expire, refresh immediately
        refreshAccessToken()
          .then(({ data }) => {
            setAccessToken(data.accessToken);
          })
          .catch(handleLogout);
      } else {
        // Set up refresh timer
        const refreshTimer = setTimeout(async () => {
          try {
            const { data } = await refreshAccessToken();
            setAccessToken(data.accessToken);
          } catch (error) {
            console.error(error);
            handleLogout();
          }
        }, timeUntilRefresh);

        return () => clearTimeout(refreshTimer);
      }
    } catch (error) {
      console.error("Error setting up token refresh:", error);
      handleLogout();
    }
  }, [accessToken, handleLogout, setAccessToken]);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await getAuthenticatedUser(accessToken);
        setUser({
          data: data,
          isAuthenticated: true,
          isError: null,
        });
      } catch (error) {
        //toast.error("Session expired. Please login again");
        console.error("Error fetching user:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    const cleanup = setupTokenRefresh();
    return () => cleanup?.();
  }, [accessToken, handleLogout, setupTokenRefresh]);

  const value = {
    accessToken,
    setAccessToken,
    user,
    setUser,
    loading,
  };

  return <AuthStore.Provider value={value}>{children}</AuthStore.Provider>;
};
