import axiosClient from "./axiosClient";
import type { UserModel } from "../models/user";

export const userApi = {
  getAll: () =>
    axiosClient
      .post<{ listUsers: UserModel[] }>("/setup-form", { catalogs: ["USER"] })
      .then((r) => r.data?.listUsers || []),
};
