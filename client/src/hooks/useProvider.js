import { AuthStore } from "@/store";
import { useContext } from "react";

export const useAuthStore = () => useContext(AuthStore);
