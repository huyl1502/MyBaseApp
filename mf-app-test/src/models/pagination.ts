export interface PagedRequest<T = any> {
  pageIndex: number;
  pageSize: number;
  filter?: T;
}

export interface PagedResponse<T> {
  items: T[];
  totalRecords: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}
