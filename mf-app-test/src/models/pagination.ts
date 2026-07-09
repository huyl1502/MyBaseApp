export interface PagedRequest<T = unknown> {
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
