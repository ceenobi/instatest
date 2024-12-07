import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import App from "./App.jsx";
import { AuthProvider } from "./store/AuthProvider";
import { NotificationProvider } from "./store/NotificationProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);
