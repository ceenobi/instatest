import { RouterProvider } from "react-router-dom";
import router from "@/routes/appRoutes";
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from "./hooks";
import { LazySpinner } from "@/components";
import { Toaster } from "sonner";

function App() {
  const { user } = useAuthStore();

  if (user?.isCheckingAuth) {
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
