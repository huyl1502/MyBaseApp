import axiosClient from "./axiosClient";
import type { MenuModel } from "../models/menu";

const BASE = "/menu";

export const menuApi = {
  getAll: () =>
    axiosClient.get<MenuModel[]>(`${BASE}/GetAllMenus`).then((r) => r.data),

  getById: (menuId: string) =>
    axiosClient
      .get<MenuModel>(`${BASE}/GetMenuById/${menuId}`)
      .then((r) => r.data),

  insert: (menu: MenuModel) =>
    axiosClient.post<boolean>(`${BASE}/InsertMenu`, menu).then((r) => r.data),

  update: (menu: MenuModel) =>
    axiosClient.put<boolean>(`${BASE}/UpdateMenu`, menu).then((r) => r.data),

  delete: (menuId: string) =>
    axiosClient
      .delete<boolean>(`${BASE}/DeleteMenu/${menuId}`)
      .then((r) => r.data),
};
