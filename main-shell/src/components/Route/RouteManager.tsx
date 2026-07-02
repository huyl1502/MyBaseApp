// router/RouteManager.tsx

import { Routes, Route } from "react-router-dom";

import AuthWrapper from "../AuthWrapper";
import { routes } from "./RouteConfig";
import DynamicRemoteScreen from "../../layout/screens/DynamicRemoteScreen";

export default function RouteManager() {
  return (
    <Routes>
      {routes.map((route) => {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.auth ? (
                <AuthWrapper>
                  <DynamicRemoteScreen moduleName={route.moduleName} expose={route.expose} />
                </AuthWrapper>
              ) : (
                <DynamicRemoteScreen moduleName={route.moduleName} expose={route.expose} />
              )
            }
          />
        );
      })}

      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}