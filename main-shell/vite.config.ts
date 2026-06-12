import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",

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
  },

  build: {
    target: "esnext",
  },
});
