import axiosClient from "./axiosClient";
import type { FeatureModel } from "../models/feature";
import type { PagedRequest, PagedResponse } from "../models/pagination";

const BASE = "/feature";

export const featureApi = {
  getAll: () =>
    axiosClient.get<FeatureModel[]>(`${BASE}/GetAllFeatures`).then((r) => r.data),

  getFeaturesPaged: (request: PagedRequest) =>
    axiosClient
      .get<PagedResponse<FeatureModel>>(`${BASE}/GetFeaturesPaged`, { params: request })
      .then((r) => r.data),

  getById: (featureId: string) =>
    axiosClient
      .get<FeatureModel>(`${BASE}/GetFeatureById/${featureId}`)
      .then((r) => r.data),

  insert: (feature: FeatureModel) =>
    axiosClient.post<boolean>(`${BASE}/InsertFeature`, feature).then((r) => r.data),

  update: (feature: FeatureModel) =>
    axiosClient.put<boolean>(`${BASE}/UpdateFeature`, feature).then((r) => r.data),

  delete: (featureId: string) =>
    axiosClient
      .delete<boolean>(`${BASE}/DeleteFeature/${featureId}`)
      .then((r) => r.data),
};
