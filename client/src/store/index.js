import { createContext } from "react";
import { AuthProvider } from "./AuthProvider";
import { PostProvider } from "./PostProvider";
import { NotificationProvider } from "./NotificationProvider";

const AuthStore = createContext({});
const PostStore = createContext({});
const NotificationContext = createContext({});

export {
  AuthStore,
  AuthProvider,
  PostStore,
  PostProvider,
  NotificationContext,
  NotificationProvider,
};
