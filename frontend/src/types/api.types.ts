export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error: ApiError | null;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{
    field?: string;
    message: string;
  }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  nextCursor?: string | null;
  hasMore?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
