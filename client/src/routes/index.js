import { lazy } from "react";

const AuthLayout = lazy(() => import("@/layouts/Auth"));
const RecoverLayout = lazy(() => import("@/layouts/Recover"));
const RootLayout = lazy(() => import("@/layouts/Root"));

export { AuthLayout, RecoverLayout, RootLayout };
