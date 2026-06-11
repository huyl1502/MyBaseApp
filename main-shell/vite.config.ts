import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",

      shared: {
        react: {
          requiredVersion: false,
        },
        "react-dom": {
          requiredVersion: false,
        },
        "react-router-dom": {
          requiredVersion: false,
        },
        antd: {
          requiredVersion: false,
        },
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
