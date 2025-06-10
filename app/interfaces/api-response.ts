import { AxiosError, HttpStatusCode } from 'axios';

export type responseError = AxiosError<IBaseApiResponse | unknown>;

export interface IBaseApiResponse<Data = Record<string, unknown> | null | unknown> {
  status: string;
  code: HttpStatusCode;
  success: boolean;
  message: string;
  data: Data;
}
