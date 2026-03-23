export interface PaginationParams {
  limit: number;
  cursor?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
