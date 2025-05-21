import { createRoot } from "react-dom/client";
import App from "../App";
import "../index.css";

function initializeWidget() {
  const slug = window.__CHATBOT_SLUG__;

  if (!slug) {
    console.error(
      "Chatbot Widget: Missing slug. Please add data-slug attribute to the script tag."
    );
    return;
  }

  const containerId = "chatbot-widget-root";
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  console.log("Rendering chatbot with slug:", slug);
  const root = createRoot(container);
  root.render(<App slug={slug} />);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWidget);
} else {
  initializeWidget();
}

// Make the global type available
declare global {
  interface Window {
    __CHATBOT_SLUG__?: string;
  }
}
