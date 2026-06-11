import Keycloak from "keycloak-js";
import { getConfig } from "../config/config";

let keycloak: Keycloak;

export const initKeycloak = async () => {
  const config = getConfig();

  keycloak = new Keycloak({
    url: config.keycloak.url,
    realm: config.keycloak.realm,
    clientId: config.keycloak.clientId,
  });

  const authenticated = await keycloak.init({
    onLoad: "login-required",
    checkLoginIframe: false,
    pkceMethod: "S256",
  });

  return authenticated;
};

export const getKeycloak = () => keycloak;
