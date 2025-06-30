import appClient from '@/api/app-client';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/storage';

export const MutationConfigs = {
  verifyEmail: async (user: { email: string, isResetPassword?: boolean }) => {
    return appClient.post('/auth/verify-email', user);
  },
  verifyOtp: async (user: { email: string, otp: string }) => {
    return appClient.post('/auth/verify-otp', user);
  },
  register: async (user: { email: string, password: string }) => {
    return appClient.post('/auth/register', user);
  },
  login: async (user: { email: string, password: string } | { username: string, password: string }) => {
    return appClient.post('/auth/login', user);
  },
  google: async (user: { email: string, googleId: string }) => {
    return appClient.post('/auth/google', user);
  },
  sendOtp: async (email: string) => {
    return appClient.post('/auth/send-otp', { email });
  },
  forgotPassword: async (user: { email: string, password: string }) => {
    return appClient.post('/auth/forgot-password', user);
  },
  logout: async () => {
    return appClient.delete('/auth/logout', {
      headers: {
        Authorization: `Bearer ${secureStorage.getString(StorageKey.RefreshToken)}`,
      },
    });
  },
};
