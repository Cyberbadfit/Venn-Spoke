import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/Full-Stack-Web-Development-Projects/" : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": { target: "http://127.0.0.1:4000", changeOrigin: true },
    },
  },
});
