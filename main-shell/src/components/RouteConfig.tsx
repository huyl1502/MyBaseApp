// router/RouteConfig.ts

import TestPage from "../layout/screens/TestPage";

export interface AppRoute {
  path: string;
  auth?: boolean;
  element: React.ComponentType<any>;
}

export const routes: AppRoute[] = [
  {
    path: "/test",
    auth: false,
    element: TestPage,
  },
];