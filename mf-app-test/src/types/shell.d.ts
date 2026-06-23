declare module "shell/keycloak" {
  import type Keycloak from "keycloak-js";
  export const getKeycloak: () => Keycloak;
  export const initKeycloak: () => Promise<boolean>;
}

declare module "shell/config" {
  export interface AppConfig {
    apiUrl: string;
    timeout: number;
    keycloak: {
      url: string;
      realm: string;
      clientId: string;
    };
  }
  export const getConfig: () => AppConfig;
  export const loadConfig: () => Promise<void>;
}
