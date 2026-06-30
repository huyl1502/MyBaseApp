// router/RouteConfig.ts

import MenuPage from "../../layout/screens/MenuPage";
import FeaturePage from "../../layout/screens/FeaturePage";
import FunctionPage from "../../layout/screens/FunctionPage";
import RolePage from "../../layout/screens/RolePage";
import RightPage from "../../layout/screens/RightPage";

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
  {
    path: "/Feature",
    auth: false,
    element: FeaturePage,
  },
  {
    path: "/Function",
    auth: false,
    element: FunctionPage,
  },
  {
    path: "/Role",
    auth: false,
    element: RolePage,
  },
  {
    path: "/Right",
    auth: false,
    element: RightPage,
  },
];