import { createContext } from "react";
import { AuthProvider } from "./AuthProvider";

const AuthStore = createContext({});
export { AuthStore, AuthProvider };
