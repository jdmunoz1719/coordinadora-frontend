import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@dashboard": path.resolve(__dirname, "./src/features/dashboard"),
      "@incidents": path.resolve(__dirname, "./src/features/incidents"),
      "@alerts": path.resolve(__dirname, "./src/features/alerts"),
      "@events": path.resolve(__dirname, "./src/features/events"),
      "@master": path.resolve(__dirname, "./src/features/master"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
