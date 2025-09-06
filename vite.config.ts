import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import fs from 'fs';
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost-cert.pem'),
    },
    host: '0.0.0.0', // Optional: allows access from LAN/mobile
    port: 5173,       // Or your preferred port
  },
  
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
