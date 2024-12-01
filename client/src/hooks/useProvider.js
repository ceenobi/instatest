import { AuthStore, PostStore } from "@/store";
import { useContext } from "react";

export const useAuthStore = () => useContext(AuthStore);
export const usePostStore = () => useContext(PostStore);
