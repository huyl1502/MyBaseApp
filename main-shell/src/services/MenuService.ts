import axiosClient from "../api/axiosClient";
import type { MenuDto } from "../models/DTO/MenuDTO";

export async function getMenus() {
  const response = await axiosClient.get<MenuDto[]>("/menu/GetMenuUser");
  return response;
} 