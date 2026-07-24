import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

const loader = document.getElementById("loader");
if (loader) {
  setTimeout(() => {
    loader.style.transition = "opacity 0.6s ease";
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 600);
  }, 3000);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>,
);
