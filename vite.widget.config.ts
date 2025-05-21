import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        process: true,
        Buffer: true,
      },
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/widget/chatbot-widget.tsx"),
      name: "ChatbotWidget",
      fileName: () => "chatbot-widget.iife.js",
      formats: ["iife"],
    },
    outDir: "dist/widget",
    emptyOutDir: false,
    cssCodeSplit: false, // Keep this to bundle CSS with JS
    rollupOptions: {
      treeshake: true,
      output: {
        // Ensure styles are inlined in the JS bundle
        inlineDynamicImports: true,
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser",
    },
  },
  define: {
    "import.meta.env.VITE_WIDGET_SCRIPT_BASE": JSON.stringify(process.env.VITE_WIDGET_SCRIPT_BASE),
    "process.env": {},
  },
})
