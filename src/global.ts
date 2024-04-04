import { AxiosInstance } from 'axios';
import { ILibOptions, ILocalStorageAuthService } from './interfaces';

export let axiosInstance = {} as AxiosInstance;

export let localStorageAuthService = {} as ILocalStorageAuthService;

export let libOptions = {} as ILibOptions;

export const setAxiosInstance = (axios: AxiosInstance) => {
  axiosInstance = axios;
};

export const setLocalStorageAuthService = (localStorage: ILocalStorageAuthService) => {
  localStorageAuthService = localStorage;
};

export const setLibOptions = (options: ILibOptions) => {
  libOptions = options;
};
