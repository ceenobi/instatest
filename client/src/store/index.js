import { createContext } from "react";
import { AuthProvider } from "./AuthProvider";
import { PostProvider } from "./PostProvider";

const AuthStore = createContext({});
const PostStore = createContext({});

export { AuthStore, AuthProvider, PostStore, PostProvider };
