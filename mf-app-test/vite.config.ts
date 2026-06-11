import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "patient",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: {
          requiredVersion: false,
        },
        "react-dom": {
          requiredVersion: false,
        },
        antd: {
          requiredVersion: false,
        },
      },
    }),
  ],

  server: {
    port: 3002,
  },
  preview: {
    port: 3002,
  },

  build: {
    target: "esnext",
  },
});
