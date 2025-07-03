export type Paginated = {
  meta: {
    page: number;
    hasMore: boolean;
    totalPages: number;
  };
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
  Horizontal,
  Vertical,
}
