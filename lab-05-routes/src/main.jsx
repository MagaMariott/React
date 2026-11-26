import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { registerServiceWorker } from "./services/serviceWorker.js";
import { store } from "./store/store.js";
import App from "./App.jsx";
import "./styles/app.css";

registerServiceWorker();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
