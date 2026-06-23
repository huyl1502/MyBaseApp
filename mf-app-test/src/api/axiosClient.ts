import axios from "axios";
import { getKeycloak } from "shell/keycloak";
import { getConfig } from "shell/config";

const axiosClient = axios.create({
  timeout: 30000,
});

axiosClient.interceptors.request.use(async (config) => {
  const keycloak = getKeycloak();

  if (!config.skipAuth && keycloak?.authenticated) {
    await keycloak.updateToken(30);
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  config.baseURL = getConfig().apiUrl;

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      getKeycloak()?.login();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
