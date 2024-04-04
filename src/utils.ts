import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { throttle } from 'lodash';
import { HttpStatus, LOCAL_STORAGE_KEY, requestOptions } from './constants';
import { IDecodeToken } from './interfaces';
import { libOptions, localStorageAuthService } from './global';

export function isJson(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
}

const getRefreshToken = async () => {
  try {
    const refreshToken = localStorageAuthService.getRefreshToken?.();
    const api = axios.create({ ...requestOptions, ...libOptions.requestOptions });
    const response = await api.post(
      '/auth/refresh-token',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );
    if (response.status === HttpStatus.OK) {
      const data = response.data?.data;
      localStorageAuthService.setAccessToken(data?.accessToken?.token);
      localStorageAuthService.setRefreshToken(data?.refreshToken?.token);
      return;
    }
    // reset local storage
    localStorageAuthService.resetAll();
  } catch (error) {
    localStorageAuthService.resetAll();
  }
};

export const refreshTokenThrottled = throttle(getRefreshToken, 10000, {
  trailing: false,
});

export const checkAccessTokenExpireTime = async () => {
  const accessToken = localStorageAuthService.getAccessToken();
  const refreshToken = localStorageAuthService.getRefreshToken();
  if (!accessToken || !refreshToken) {
    localStorageAuthService.resetAll();
    return;
  }
  const decodeAccessToken: IDecodeToken = jwtDecode(accessToken);
  if (
    libOptions.refreshTokenTimeBufferInSecond &&
    decodeAccessToken.exp - Date.now() < libOptions.refreshTokenTimeBufferInSecond
  ) {
    await refreshTokenThrottled();
  }
};

export const localStorageAuthServiceDefault = {
  getAccessToken: () => localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN) || '',
  setAccessToken: (token: string) =>
    localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, token),
  getRefreshToken: () => localStorage.getItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN) || '',
  setRefreshToken: (token: string) =>
    localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, token),
  resetAll: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
  },
};
