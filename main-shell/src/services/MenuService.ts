import axiosClient from "../apiCaller/axiosClient";
import type { MenuDto } from "../models/DTO/MenuDTO";

export async function getMenus() {
  const response = await axiosClient.get<MenuDto[]>("/menu/GetAllMenus");
  return response;
}