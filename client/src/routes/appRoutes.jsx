import { LazySpinner } from "@/components";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, RecoverLayout, RootLayout } from ".";
import { ForgotPassword, Home, Login, Signup, VerifyLogin } from "@/pages";

const routes = [
  {
    path: "auth",
    element: (
      <Suspense fallback={<LazySpinner />}>
        <AuthLayout />
      </Suspense>
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
        element: <ForgotPassword />,
      },
      {
        path: "email-login/:userId/:token",
        element: <VerifyLogin />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<LazySpinner />}>
        <RootLayout />
      </Suspense>
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
