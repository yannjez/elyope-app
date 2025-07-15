export type ListRequestType = {
  page?: number;
  sort?: string;
  sortDirection?: string;
  search?: string;
};

export type PaginationInfo = {
  totalPages: number;
};
