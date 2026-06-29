import axiosClient from "./axiosClient";
import type { FunctionModel } from "../models/function";
import type { PagedRequest, PagedResponse } from "../models/pagination";

const BASE = "/function";

export const functionApi = {
  getAll: () =>
    axiosClient.get<FunctionModel[]>(`${BASE}/GetAllFunctions`).then((r) => r.data),

  getFunctionsPaged: (request: PagedRequest) =>
    axiosClient
      .get<PagedResponse<FunctionModel>>(`${BASE}/GetFunctionsPaged`, { params: request })
      .then((r) => r.data),

  getById: (functionId: string) =>
    axiosClient
      .get<FunctionModel>(`${BASE}/GetFunctionById/${functionId}`)
      .then((r) => r.data),

  insert: (func: FunctionModel) =>
    axiosClient.post<boolean>(`${BASE}/InsertFunction`, func).then((r) => r.data),

  update: (func: FunctionModel) =>
    axiosClient.put<boolean>(`${BASE}/UpdateFunction`, func).then((r) => r.data),

  delete: (functionId: string) =>
    axiosClient
      .delete<boolean>(`${BASE}/DeleteFunction/${functionId}`)
      .then((r) => r.data),

  getFunctionTree: () =>
    axiosClient.get<FunctionModel[]>(`${BASE}/GetFunctionTree`).then((r) => r.data),
};
