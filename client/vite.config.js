import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // all requests starting with /api will be sent to backend
      "/api": {
        target: "http://localhost:8080", // backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
