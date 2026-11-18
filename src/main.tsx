import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { copy } from "./ui/copy";
import { StartScreen } from "./ui/screens/StartScreen";
import "./ui/styles/tokens.css";

document.title = copy.start.title;

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root element in index.html");
}

createRoot(root).render(
  <StrictMode>
    <StartScreen />
  </StrictMode>,
);
