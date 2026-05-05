export interface BaseResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface Option {
  value: string | number;
  label: string;
}
