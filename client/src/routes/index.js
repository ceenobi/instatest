import { lazy } from "react";

const AuthLayout = lazy(() => import("@/layouts/Auth"));
const ResetLayout = lazy(() => import("@/layouts/Reset"));

export { AuthLayout, ResetLayout };
