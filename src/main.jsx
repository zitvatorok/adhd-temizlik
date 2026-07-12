import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/shell/AppShell.jsx";
import { initStorage } from "./app/lib/storage.js";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";

initStorage().then(() => {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
