import appClient from '@/api/app-client';

export const MutationConfigs = {
  verifyEmail: async (email: string) => {
    return appClient.post('/auth/verify-email', { email });
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
  resendOtp: async (email: string) => {
    return appClient.post('/auth/resend-otp', { email });
  },
  logout: async () => {
    return appClient.delete('/auth/logout');
  },
};
