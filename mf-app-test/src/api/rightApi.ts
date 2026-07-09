import axiosClient from "./axiosClient";
import type { RightModel } from "../models/right";
import type { RoleModel } from "../models/role";
import type { FeatureModel } from "../models/feature";
import type { FunctionModel } from "../models/function";

const BASE = "/right";

export const rightApi = {
  getAll: () =>
    axiosClient.get<RightModel[]>(`${BASE}/GetAllRights`).then((r) => r.data),

  insert: (right: RightModel) =>
    axiosClient.post<boolean>(`${BASE}/InsertRight`, right).then((r) => r.data),

  delete: (rightId: string) =>
    axiosClient.delete<boolean>(`${BASE}/DeleteRight/${rightId}`).then((r) => r.data),

  setupForm: () =>
    axiosClient
      .post<{
        listRoles?: RoleModel[];
        listFeatures?: FeatureModel[];
        listFunctions?: FunctionModel[];
      }>(`${BASE}/SetupForm`)
      .then((r) => r.data),
};
