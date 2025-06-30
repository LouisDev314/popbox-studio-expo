import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import getEnvConfig from '@/configs/env';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/storage';
import { IBaseApiResponse } from '@/interfaces/api-response';

type QueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

const appClient: AxiosInstance = axios.create({
  baseURL: getEnvConfig().apiBaseUrl,
  timeout: 10000,
  timeoutErrorMessage: 'timeout of 10000 ms exceeded',
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (err: unknown | null, token: string | null = null): void => {
  failedQueue.forEach(prom => {
    if (err) prom.reject(err);
    else prom.resolve(token);
  });
  failedQueue = [];
};

appClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (!config.headers.Authorization) {
    const token = secureStorage.getString(StorageKey.AccessToken);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

appClient.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError<IBaseApiResponse<unknown>, unknown>) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (err.response?.status === 401 && err.response?.data.message.includes('token') && !originalRequest._retry) {
      // Queue requests when refresh is in progress
      if (isRefreshing) {
        // turn failed request into Promise and store in failedQueue
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // retry the queued request after it is being resolved through processQueue()
          return appClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Refresh token call
      try {
        const { data } = await appClient.post<{
          accessToken: string;
          refreshToken: string
        }>(`${getEnvConfig().apiBaseUrl}/auth/rotate-token`, {
          refreshToken: secureStorage.getString(StorageKey.RefreshToken),
        });
        secureStorage.set(StorageKey.AccessToken, data.accessToken);
        secureStorage.set(StorageKey.RefreshToken, data.refreshToken);
        // set auth header
        appClient.defaults.headers.common['authorization'] = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken);
        // retry original request
        return appClient(originalRequest);
      } catch (refreshErr) {
        // Process queue with error
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  },
);

export default appClient;
