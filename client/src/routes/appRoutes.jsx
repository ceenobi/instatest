import { LazySpinner } from "@/components";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, RecoverLayout, RootLayout } from ".";
import {
  ForgotPassword,
  Home,
  Login,
  Signup,
  VerifyEmail,
  VerifyLogin,
} from "@/pages";
import { PrivateRoutes, PublicRoutes } from "./ProtectedRoutes";

const routes = [
  {
    path: "auth",
    element: (
      <PublicRoutes>
        <Suspense fallback={<LazySpinner />}>
          <AuthLayout />
        </Suspense>
      </PublicRoutes>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "account",
    element: (
      <Suspense fallback={<LazySpinner />}>
        <RecoverLayout />
      </Suspense>
    ),
    children: [
      {
        path: "forgot-password",
        element: (
          <PublicRoutes>
            <ForgotPassword />
          </PublicRoutes>
        ),
      },
      {
        path: "email-login/:userId/:token",
        element: (
          <PublicRoutes>
            <VerifyLogin />
          </PublicRoutes>
        ),
      },
      {
        path: "verify-email/:userId/:verificationToken",
        element: <VerifyEmail />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <PrivateRoutes>
        <Suspense fallback={<LazySpinner />}>
          <RootLayout />
        </Suspense>
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export default router;
