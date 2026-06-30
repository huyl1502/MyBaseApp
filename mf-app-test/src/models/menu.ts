export interface MenuModel {
  MenuId: string;
  MenuName: string;
  Icon?: string;
  Url?: string;
  ParentMenuId?: string;
  OrderIndex?: number;
  Enabled?: boolean;
}
