export interface ApiResponse<T> {
  isSuccess: boolean;
  errorCode: string;
  message: string;
  data: T;
}
