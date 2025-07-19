import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import getEnvConfig from '@/configs/env';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/storage';
import { auth } from '@/configs/firebase';

const appClient: AxiosInstance = axios.create({
  baseURL: getEnvConfig().apiBaseUrl,
  timeout: 10000,
  timeoutErrorMessage: 'timeout of 10000 ms exceeded',
});

appClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  config.headers['device-id'] = secureStorage.getString(StorageKey.DeviceId);

  const token = await auth.currentUser?.getIdToken();
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default appClient;
