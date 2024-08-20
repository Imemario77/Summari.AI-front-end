import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./public/manifest.json";

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest,
      output: {
        format: "iife", // Self-invoking function for Chrome Extension
      },
    }),
  ],
});
