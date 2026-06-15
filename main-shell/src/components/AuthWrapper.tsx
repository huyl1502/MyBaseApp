// router/AuthWrapper.tsx

import { getKeycloak } from "../keycloak/keycloak";

type Props = {
  children: React.ReactNode;
};

export default function AuthWrapper({ children }: Props) {
  const keycloak = getKeycloak();

  if (!keycloak.authenticated) {
    keycloak.login();

    return <div>Redirecting to login...</div>;
  }

  return <>{children}</>;
}