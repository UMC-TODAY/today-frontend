// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://107.20.245.245",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://107.20.245.245",
        changeOrigin: true,
        secure: false,
      },
      "/members": {
        target: "http://107.20.245.245",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
