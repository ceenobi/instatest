import { RouterProvider } from "react-router-dom";
import router from "@/routes/appRoutes";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <HelmetProvider>
        <Toaster position="top-center" expand={true} richColors/>
        <RouterProvider router={router} />
      </HelmetProvider>
    </>
  );
}

export default App;
