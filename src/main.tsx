import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import DeveloperLinks from "./DeveloperLinks";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /><DeveloperLinks /></StrictMode>,
);
