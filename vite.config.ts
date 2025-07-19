import { defineConfig, type LibraryFormats } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// Common configuration shared between both builds
const commonConfig = {
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        process: true,
        Buffer: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser",
    },
  },
};

// Main library configuration
const libraryConfig = {
  ...commonConfig,
  plugins: [
    ...commonConfig.plugins,
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
      formats: ["umd", "es"] as LibraryFormats[],
    },
    rollupOptions: {
      treeshake: true,
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css';
          return assetInfo.name;
        },
      },
    },
  },
  define: { 'process.env.NODE_ENV': '"production"' },
};

// Widget configuration
const widgetConfig = {
  ...commonConfig,
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/widget/chatbot-widget.tsx"),
      name: "ChatbotWidget",
      fileName: () => "chatbot-widget.iife.js",
      formats: ["iife"] as LibraryFormats[],
    },
    outDir: "dist/widget",
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      treeshake: false, // Disable tree-shaking to keep all CSS
      output: {
        inlineDynamicImports: true,
        assetFileNames: (assetInfo) => {
          // Always output as wavebox.css for any CSS asset
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'wavebox.css';
          return assetInfo.name;
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
    modules: {
      localsConvention: 'camelCase' as const,
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  define: {
    "import.meta.env.VITE_WIDGET_SCRIPT_BASE": JSON.stringify(process.env.VITE_WIDGET_SCRIPT_BASE),
    "process.env": {},
  },
};

// Development configuration
const devConfig = {
  ...commonConfig,
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
  },
  root: ".",
  publicDir: "public",
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
    modules: {
      localsConvention: 'camelCase' as const,
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
};

// Export configuration based on command line argument
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return devConfig;
  }
  if (command === 'build' && mode === 'widget') {
    return widgetConfig;
  }
  return libraryConfig;
});
