import { RouterProvider } from "react-router-dom";
import router from "@/routes/appRoutes";
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from "./hooks";
import { useEffect } from "react";
import { LazySpinner } from "@/components";
import { Toaster } from "sonner";

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return <LazySpinner />;
  }

  return (
    <>
      <HelmetProvider>
        <Toaster />
        <RouterProvider router={router} />
      </HelmetProvider>
    </>
  );
}

export default App;
