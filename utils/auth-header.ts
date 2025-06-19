import appClient from '@/api/app-client';
import retrieveDeviceId from '@/utils/device-id';

export const setAuthHeader = (token: string) => {
  appClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const setDeviceIdHeader = async () => {
  appClient.defaults.headers.common.deviceId = await retrieveDeviceId();
};

export const removeAuthHeader = () => {
  delete appClient.defaults.headers.common.Authorization;
};
