export interface MenuModel {
  menuId: string;
  menuName: string;
  icon?: string;
  url?: string;
  parentId?: string;
  orderIndex?: number;
  isActive?: boolean;
}
