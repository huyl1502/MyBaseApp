import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "patient",
      filename: "remoteEntry.js",
      dts: false,
      remotes: {
        shell: {
          type: "module",
          name: "shell",
          entry: "http://localhost:3000/remoteEntry.js",
        },
      },
      exposes: {
        "./App": "./src/App.tsx",
        "./Menu": "./src/screens/menu/Menu.tsx",
        "./Feature": "./src/screens/feature/Feature.tsx",
        "./Function": "./src/screens/function/Function.tsx",
        "./Role": "./src/screens/role/Role.tsx",
        "./Right": "./src/screens/right/Right.tsx",
        "./User": "./src/screens/user/User.tsx",
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
