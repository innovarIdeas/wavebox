import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      outDir: "dist",
      insertTypesEntry: true,
      rollupTypes: true,
      beforeWriteFile: (filePath, content) => {
        const newFilePath = filePath.replace("index.es.d.ts", 'index.d.ts');
        return {
          filePath: newFilePath,
          content,
        };
      },
    }),
  ],
  build: {
    cssMinify: true,
    lib: {
      entry: "./src/index.tsx",
      name: "Wavebox",
      fileName: (format) => `index.${format}.js`,
      formats: ["umd", "es"],
    },
    rollupOptions: {
      treeshake: true,
    },
  },
  define: { 'process.env.NODE_ENV': '"production"' },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser",
    },
  },
});
