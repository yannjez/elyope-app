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
