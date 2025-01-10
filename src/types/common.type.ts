export interface BaseResponse<T = object> {
  status: number;
  errorCode: string;
  message: string;
  data: T;
}
