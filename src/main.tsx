import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/auth";
import { LanguageProvider } from "./context/LanguageContext"; 

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);
