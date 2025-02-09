export interface BaseResponse<T> {
  status: number;
  errorCode: string;
  message: string;
  data: T;
}
