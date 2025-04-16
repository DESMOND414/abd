import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })], // Ensure jsxRuntime is set
  // plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8800",
        changeOrigin: true,
      },
    },
  },
});
