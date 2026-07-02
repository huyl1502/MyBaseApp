// router/RouteConfig.ts

import routesConfig from "./routes-config.json";

export interface AppRoute {
  path: string;
  auth?: boolean;
  moduleName: string;
  expose: string;
}

export const routes: AppRoute[] = routesConfig;