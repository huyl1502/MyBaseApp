import ReactDOM from "react-dom/client";
import { ConfigProvider, theme } from "antd";

import App from "./App";
import { loadConfig } from "./config/config";
import { initKeycloak } from "./keycloak/keycloak";
import { ValidatorProvider } from "./components/FieldValidator/ValidatorContext";

export default async function bootstrap() {
  await loadConfig();
  await initKeycloak();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#4f46e5", // Màu xanh indigo trơn, không gradient
          borderRadius: 4,         // Bo góc nhỏ hơn
          controlHeight: 32,       // Chiều cao mặc định của button, input
          padding: 12,             // Khoảng cách bên trong
          margin: 12,              // Khoảng cách bên ngoài
        },
        components: {
          Table: {
            cellPaddingBlock: 8,   // Padding ô trong bảng
          },
        },
      }}
    >
      <ValidatorProvider>
        <App />
      </ValidatorProvider>
    </ConfigProvider>
  );
}
