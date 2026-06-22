import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "patient",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
        "./Menu": "./src/screens/Menu.tsx",
      },
      shared: {
        react: {},
        "react-dom": {},
        antd: {},
      },
    }),
  ],

  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
  },

  build: {
    target: "esnext",
  },
});
