import appClient from '@/api/app-client';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/storage';

const MutationConfigs = {
  verifyEmail: (user: { email: string, isResetPassword?: boolean }) => {
    return appClient.post('/auth/verify-email', user);
  },
  verifyOtp: (user: { email: string, otp: string }) => {
    return appClient.post('/auth/verify-otp', user);
  },
  register: (user: { email: string, password: string }) => {
    return appClient.post('/auth/register', user);
  },
  login: (user: { email: string, password: string } | { username: string, password: string }) => {
    return appClient.post('/auth/login', user);
  },
  google: (user: { email: string, googleId: string }) => {
    return appClient.post('/auth/google', user);
  },
  sendOtp: (email: string) => {
    return appClient.post('/auth/send-otp', { email });
  },
  forgotPassword: (user: { email: string, password: string }) => {
    return appClient.post('/auth/forgot-password', user);
  },
  logout: () => {
    return appClient.delete('/auth/logout', {
      headers: {
        Authorization: `Bearer ${secureStorage.getString(StorageKey.RefreshToken)}`,
      },
    });
  },
};

export default MutationConfigs;
