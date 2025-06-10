import getEnvConfig from '@/app/configs/env';
import axios from 'axios';

const appClient = axios.create({
  baseURL: getEnvConfig().apiBaseUrl,
  timeout: 10000,
  timeoutErrorMessage: 'timeout of 10000 ms exceeded',
});

export default appClient;
