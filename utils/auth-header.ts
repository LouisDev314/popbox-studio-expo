import appClient from '@/api/app-client';
import retrieveDeviceId from '@/utils/device-id';

export const setHeaderDeviceId = async () => {
  appClient.defaults.headers.common['device-id'] = await retrieveDeviceId();
};

export const removeAuthHeader = () => {
  delete appClient.defaults.headers.common['authorization'];
};
