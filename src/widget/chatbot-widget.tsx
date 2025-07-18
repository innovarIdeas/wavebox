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

  // Try to find the shadow root container
  const shadowHost = document.getElementById("chatbot-widget-shadow-root-container");
  const shadowRoot = shadowHost && shadowHost.shadowRoot ? shadowHost.shadowRoot : undefined;

  // Use shadow root as the document for the widget
  const containerId = "chatbot-widget-root";
  let container: HTMLElement | null = null;
  if (shadowRoot) {
    container = shadowRoot.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.position = "relative";
      container.style.pointerEvents = "auto";
      shadowRoot.appendChild(container);
    }
  } else {
    // fallback for non-shadow (should not happen in widget)
    container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.position = "relative";
      container.style.pointerEvents = "auto";
      document.body.appendChild(container);
    }
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
