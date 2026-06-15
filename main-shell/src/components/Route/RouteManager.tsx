// router/RouteManager.tsx

import { Routes, Route } from "react-router-dom";

import AuthWrapper from "../AuthWrapper";
import { routes } from "./RouteConfig";

export default function RouteManager() {
  return (
    <Routes>
      {routes.map((route) => {
        const Component = route.element;

        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.auth ? (
                <AuthWrapper>
                  <Component />
                </AuthWrapper>
              ) : (
                <Component />
              )
            }
          />
        );
      })}

      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}