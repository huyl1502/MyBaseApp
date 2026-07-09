import axiosClient from "./axiosClient";
import type { UserModel } from "../models/user";
import type { PagedRequest, PagedResponse } from "../models/pagination";

const BASE = "/user";

export const userApi = {
  getAll: () =>
    axiosClient.get<UserModel[]>(`${BASE}/GetAllUsers`).then((r) => r.data),

  getUsersPaged: (request: PagedRequest) =>
    axiosClient
      .get<PagedResponse<UserModel>>(`${BASE}/GetUsersPaged`, { params: request })
      .then((r) => r.data),

  getById: (userId: string) =>
    axiosClient
      .get<UserModel>(`${BASE}/GetUserById/${userId}`)
      .then((r) => r.data),

  insert: (user: UserModel) =>
    axiosClient.post<boolean>(`${BASE}/InsertUser`, user).then((r) => r.data),

  update: (user: UserModel) =>
    axiosClient.put<boolean>(`${BASE}/UpdateUser`, user).then((r) => r.data),

  delete: (userId: string) =>
    axiosClient
      .delete<boolean>(`${BASE}/DeleteUser/${userId}`)
      .then((r) => r.data),
};
