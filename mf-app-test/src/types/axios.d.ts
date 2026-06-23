import "axios";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}
