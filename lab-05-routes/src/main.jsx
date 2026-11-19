import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { queryClient } from "./services/queryClient.js";
import { registerServiceWorker } from "./services/serviceWorker.js";
import App from "./App.jsx";
import "./styles/app.css";

registerServiceWorker();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
