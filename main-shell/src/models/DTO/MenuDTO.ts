export interface MenuDto {
  id: string;
  title: string;
  icon?: string;
  path?: string;
  children?: MenuDto[];
}