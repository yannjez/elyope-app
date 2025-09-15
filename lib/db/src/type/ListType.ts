export type ListRequestType = {
  page?: number;
  sort?: string;
  sortDirection?: string;
  search?: string;
  role?: string;
};

export type PaginationInfo = {
  totalPages: number;
};

export type SortDirection = 'asc' | 'desc';
export type SortState = {
  field?: string;
  direction?: SortDirection;
};
