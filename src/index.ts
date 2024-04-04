import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  checkAccessTokenExpireTime,
  isJson,
  localStorageAuthServiceDefault,
} from './utils';
import {
  axiosInstance,
  localStorageAuthService,
  setAxiosInstance,
  setLibOptions,
  setLocalStorageAuthService,
} from './global';
import { IBodyResponse, ILibOptions } from './interfaces';
import { HttpStatus, requestOptions } from './constants';
export * from './interfaces';
export * from './constants';
export * from './utils';
export * from './global';

export function initService(options: ILibOptions) {
  setLibOptions(options);
  setLocalStorageAuthService(
    options.localStorageAuthService || localStorageAuthServiceDefault,
  );
  setAxiosInstance(axios.create({ ...requestOptions, ...options.requestOptions }));

  axiosInstance.interceptors.request.use(async (config: any) => {
    //  check token expire
    await checkAccessTokenExpireTime();
    const accessToken = localStorageAuthService.getAccessToken();

    if (!accessToken) {
      // logout
      options?.events?.onLogout?.();
    }
    let extendHeaders = options?.headers || {};
    if (typeof options.headers === 'function') {
      extendHeaders = options.headers(config);
    }

    Object.assign(config, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...extendHeaders,
        ...config.headers,
      },
    });
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (typeof response?.data === 'string') {
        response.data = isJson(response.data) ? JSON.parse(response.data) : null;
      }
      response.data = {
        ...response?.data,
        success: true,
      };
      return response.data;
    },
    async (error) => {
      if (error.code === 'ERR_NETWORK') {
        error.request.data = {
          ...(error?.request?.data || {}),
          success: false,
          isRequestError: true,
          message: 'common.networkError',
          code: HttpStatus.NETWORK_ERROR,
        };
        return error.request.data;
      } else if (error.response) {
        // check response 401 and logout
        if (error.response.status === HttpStatus.UNAUTHORIZED) {
          options?.events?.onLogout?.();
        }

        // check response 403 and redirect Forbidden page
        if (error.response.status === HttpStatus.FORBIDDEN) {
          options?.events?.onForbidden?.();
        }

        if (typeof error?.response?.data === 'string') {
          error.response.data = JSON.parse(error.response.data);
        }
        if (error?.response?.data) {
          error.response.data = {
            code: error?.response?.status,
            ...((error?.response?.data as object) || {}),
            success: false,
          };
        }

        return error.response.data as IBodyResponse<unknown>;
      } else if (error.request) {
        error.request.data = {
          ...(error?.request?.data || {}),
          success: false,
          isRequestError: true,
          message: error.message,
        };
        return error.request?.data;
      }
      return {
        ...error,
        config: error?.config as AxiosRequestConfig,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        statusText: 'System error, please try again later',
        headers: error?.request?.headers || {},
        success: false,
        message: 'System error, please try again later',
        data: null,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    },
  );
}

export default {
  initService,
};
