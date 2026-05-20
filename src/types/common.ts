export interface BaseResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface Option {
  value: string | number;
  label: string;
}

export interface PaginationResponse<T> {
  data: T;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface PaginationRequest {
  pageSize: number;
  pageNumber: number;
}
