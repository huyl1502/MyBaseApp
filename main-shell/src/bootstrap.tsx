import ReactDOM from "react-dom/client";
import { ConfigProvider, theme } from "antd";

import App from "./App";
import { loadConfig } from "./config/config";
import { initKeycloak } from "./keycloak/keycloak";

export default async function bootstrap() {
  await loadConfig();
  await initKeycloak();

  ReactDOM.createRoot(document.getElementById("root")!).render(
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <App />
      </ConfigProvider>
  );
}
