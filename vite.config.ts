import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const githubRepository = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  // GitHub Pages serves project sites below /<repository>/.
  // Vercel and local development serve from the domain root.
  base: process.env.GITHUB_ACTIONS && githubRepository ? `/${githubRepository}/` : "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": { target: "http://127.0.0.1:4000", changeOrigin: true },
    },
  },
});
