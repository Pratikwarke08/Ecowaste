import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import fs from "fs";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({

  
  // ✅ Use "/EcoWaste/" only in production (for GitHub Pages), "/" for local dev
  base: mode === "production" ? "/EcoWaste/" : "/",
  

  plugins: [
    react(),
    mode === "development" && componentTagger(),

  ].filter(Boolean),

  

  build: {
    chunkSizeWarningLimit: 1000, // increases limit from 500kb → 1MB
  },

  server: {
    https: {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost-cert.pem"),
    },
    host: "0.0.0.0", // Optional: allows access from LAN/mobile
    port: 5173,      // Or your preferred port
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));