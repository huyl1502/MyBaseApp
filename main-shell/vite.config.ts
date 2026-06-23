import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      filename: "remoteEntry.js",

      exposes: {
        "./keycloak":    "./src/keycloak/keycloak.ts",
        "./config":      "./src/config/config.ts",
      },

      shared: {
        react: {},
        "react-dom": {},
        "react-router-dom": {},
        antd: {},
      },
    }),
  ],

  server: {
    port: 3000,
    cors: true,
  },

  build: {
    target: "esnext",
  },
});
