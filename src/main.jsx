import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

Neutralino.init();

Neutralino.events.on("windowClose", () => {
  Neutralino.app.exit();
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
