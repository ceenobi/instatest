import { LazySpinner } from "@/components";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, ResetLayout } from ".";
import { ForgotPassword, Login, Signup } from "@/pages";

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
        <ResetLayout />
      </Suspense>
    ),
    children: [
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export default router;
