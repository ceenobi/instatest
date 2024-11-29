import { LazySpinner } from "@/components";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import {
  AuthLayout,
  RecoverLayout,
  RootLayout,
  SettingsLayout,
  ViewPostLayout,
} from ".";
import {
  AccountPrivacy,
  Comments,
  DeleteAccount,
  ForgotPassword,
  Home,
  Login,
  Profile,
  Signup,
  UpdatePassword,
  VerifyAccount,
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
      {
        path: ":profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: (
          <PrivateRoutes>
            <Suspense fallback={<LazySpinner />}>
              <SettingsLayout />
            </Suspense>
          </PrivateRoutes>
        ),
        children: [
          {
            path: "update-password",
            element: <UpdatePassword />,
          },
          {
            path: "verify-account",
            element: <VerifyAccount />,
          },
          {
            path: "account-privacy",
            element: <AccountPrivacy />,
          },
          {
            path: "delete-account",
            element: <DeleteAccount />,
          },
        ],
      },
    ],
  },
  {
    path: "comments",
    element: (
      <Suspense fallback={<LazySpinner />}>
        <PrivateRoutes>
          <ViewPostLayout />
        </PrivateRoutes>
      </Suspense>
    ),
    children: [
      {
        path: ":postId",
        element: <Comments />,
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export default router;
