// router/RouteConfig.ts

import MenuPage from "../../layout/screens/MenuPage";

export interface AppRoute {
  path: string;
  auth?: boolean;
  element: React.ComponentType<any>;
}

export const routes: AppRoute[] = [
  {
    path: "/Menu",
    auth: false,
    element: MenuPage,
  },
];