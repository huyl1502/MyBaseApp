import axiosClient from "./axiosClient";
import type { RoleModel } from "../models/role";
import type { PagedRequest, PagedResponse } from "../models/pagination";

const BASE = "/role";

export const roleApi = {
  getAll: () =>
    axiosClient.get<RoleModel[]>(`${BASE}/GetAllRoles`).then((r) => r.data),

  getRolesPaged: (request: PagedRequest) =>
    axiosClient
      .get<PagedResponse<RoleModel>>(`${BASE}/GetRolesPaged`, { params: request })
      .then((r) => r.data),

  getById: (roleId: string) =>
    axiosClient
      .get<RoleModel>(`${BASE}/GetRoleById/${roleId}`)
      .then((r) => r.data),

  insert: (role: RoleModel) =>
    axiosClient.post<boolean>(`${BASE}/InsertRole`, role).then((r) => r.data),

  update: (role: RoleModel) =>
    axiosClient.put<boolean>(`${BASE}/UpdateRole`, role).then((r) => r.data),

  delete: (roleId: string) =>
    axiosClient
      .delete<boolean>(`${BASE}/DeleteRole/${roleId}`)
      .then((r) => r.data),

  mapUserToRole: (userId: string, roleId: string) =>
    axiosClient
      .post<boolean>(`${BASE}/MapUserToRole`, null, {
        params: { userId, roleId },
      })
      .then((r) => r.data),

  removeUserFromRole: (userId: string, roleId: string) =>
    axiosClient
      .post<boolean>(`${BASE}/RemoveUserFromRole`, null, {
        params: { userId, roleId },
      })
      .then((r) => r.data),

  getUserIdsByRoleId: (roleId: string) =>
    axiosClient
      .get<string[]>(`${BASE}/GetUserIdsByRoleId/${roleId}`)
      .then((r) => r.data),
};
