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
    isLoading: false,
    isError: null,
    data: null,
    isCheckingAuth: true,
  });

  const contextData = { user, accessToken, setAccessToken };
  return (
    <AuthStore.Provider value={contextData}>{children}</AuthStore.Provider>
  );
};
