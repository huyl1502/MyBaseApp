export interface MenuDto {
  MenuId: string;
  MenuName: string;
  Icon?: string;
  Url?: string;
  Children?: MenuDto[];
}