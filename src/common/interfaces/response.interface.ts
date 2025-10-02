export interface IResponse<T> {
  status_code: number;
  message: string;
  data: T;
  version: string;
}
