import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpStatus, OrderDirection } from './constants';

export interface IErrorItem {
  key: string;
  message: string;
  errorCode: HttpStatus;
  order?: number;
}

export interface IBodyResponse<T> extends AxiosResponse {
  success: boolean;
  code: HttpStatus;
  isRequestError?: boolean;
  message: string;
  data: T;
  errors?: IErrorItem[];
  errorCode?: string;
}

export interface ICommonListQuery {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  keyword?: string;
}

export interface IGetListResponse<T> {
  items: T[];
  totalItems: number;
}

export interface IDecodeToken {
  email: string;
  exp: number;
  expiresIn: number;
  iat: number;
  id: string;
  name: string;
}

export interface ILocalStorageAuthService {
  getAccessToken: () => string;
  setAccessToken: (token: string) => void;
  getRefreshToken: () => string;
  setRefreshToken: (token: string) => void;
  resetAll: () => void;
}

type IHeadersFunction = (config: AxiosRequestConfig) => Record<string, string>;

export interface ILibOptions {
  requestOptions?: AxiosRequestConfig;
  refreshTokenTimeBufferInSecond?: number;
  localStorageAuthService?: ILocalStorageAuthService;
  headers?: Record<string, string> | IHeadersFunction;
  events?: {
    onLogout?: () => void;
    onForbidden?: () => void;
  };
  refreshTokenRoute?: string;
  accessTokenKey?: string;
  refreshTokenKey?: string;
  expiredTimeKey?: string;
}