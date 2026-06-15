export interface AppConfig {
  apiUrl: string;
  timeout: number;
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
  };
}

let appConfig: AppConfig;

export const loadConfig = async () => {
  const response = await fetch("/config.json");
  appConfig = await response.json();
};

export const getConfig = () => {
  return appConfig;
};
