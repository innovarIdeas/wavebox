// vite.widget.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/widget/chatbot-widget.tsx"),
      name: "ChatbotWidget",
      fileName: "chatbot-widget",
      formats: ["iife"],
    },
    outDir: "dist/widget",
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser",
    },
  },
});
