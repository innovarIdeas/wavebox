import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/widget.ts', // Adjust this if your path differs
      name: 'WaveboxWidget',
      fileName: () => 'widget.js',
      formats: ['iife'], // IIFE = Immediately Invoked Function Expression
    },
    outDir: 'dist-widget',
    rollupOptions: {
      output: {
        globals: {
          window: 'window',
        },
      },
    },
  },
});
