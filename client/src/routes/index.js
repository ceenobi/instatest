import { lazy } from "react";

const AuthLayout = lazy(() => import("@/layouts/Auth"));
const RecoverLayout = lazy(() => import("@/layouts/Recover"));
const RootLayout = lazy(() => import("@/layouts/Root"));
const SettingsLayout = lazy(() => import("@/layouts/Settings"));
const ViewPostLayout = lazy(() => import("@/layouts/ViewPost"));

export { AuthLayout, RecoverLayout, RootLayout, SettingsLayout, ViewPostLayout };
