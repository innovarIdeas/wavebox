import React from "react";
import { createRoot } from "react-dom/client";
import App from "../App";

const slug = window.__CHATBOT_SLUG__;

const containerId = "chatbot-widget-root";

let container = document.getElementById(containerId);
if (!container) {
  container = document.createElement("div");
  container.id = containerId;
  document.body.appendChild(container);
}

createRoot(container).render(<App slug={slug!} />);
