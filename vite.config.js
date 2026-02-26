import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "src",
  build: {
    outDir: path.resolve(__dirname, "resources"),
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, "src/index.html"),
      output: {
        entryFileNames: "js/app.js",
        chunkFileNames: "js/[name].js",
        assetFileNames: (info) => {
          if (info.name?.endsWith(".css")) return "css/[name][extname]";
          return "assets/[name][extname]";
        },
      },
    },
  },
});
