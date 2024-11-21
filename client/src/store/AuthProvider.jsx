import { getAuthenticatedUser } from "@/api";
import { useLocalStorage } from "@/hooks";
import { createContext, useState } from "react";

export const AuthStore = createContext({});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useLocalStorage(
    "instaAccessToken",
    null
  );
  const [user, setUser] = useState({
    isAuthenticated: false,
    isError: null,
    data: null,
    isCheckingAuth: true,
  });


  const checkAuth = async () => {
    setUser({ isError: null, isCheckingAuth: true });
    try {
      const res = await getAuthenticatedUser(accessToken);
      setUser({
        data: res.data,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      setUser({
        isError: error,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  };

  const contextData = { user, accessToken, setAccessToken, checkAuth };
  return (
    <AuthStore.Provider value={contextData}>{children}</AuthStore.Provider>
  );
};
