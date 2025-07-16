export type Paginated = {
  meta: {
    page: number;
    hasMore: boolean;
    totalPages: number;
    totalRows: number;
    currentRows: number;
    limit: number;
  };
};

export type PaginatedApiArgs = {
  limit: number;
};

export type ApiData<T> = {
  data: T;
  success: boolean;
};

export type ApiDataPaginated<T> = ApiData<T[]> & Paginated;

export enum SortOrder {
  Ascending = "asc",
  Descending = "desc",
}

export enum Orientation {
  None,
  Horizontal,
  Vertical,
}

export enum Toggle {
  Off,
  On,
  None,
}
