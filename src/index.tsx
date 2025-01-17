import "./index.css";
import ChatBubbleDialog from "./components/chat-bubble-dialog";
import { createRoot } from 'react-dom/client';

export { default as ChatBubbleDialog } from "./components/chat-bubble-dialog";
export * from "./components/chat-bubble-dialog";

declare global {
  interface Window {
    ChatBubbleDialog: typeof ChatBubbleDialog;
  }
}

(() => {
  if (typeof window === "undefined") return;
  const docElm = window.document.documentElement;

  const outerDiv = window.document.createElement("div");
  const innerDiv = window.document.createElement("div");

  outerDiv.setAttribute("id", "innovar-wave-wrapper")
  outerDiv.appendChild(innerDiv)
  docElm.appendChild(outerDiv)

  const root = createRoot(innerDiv);
  
  if (!root) return;
  root.render(<ChatBubbleDialog />)
})();

