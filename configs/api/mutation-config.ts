import appClient from '@/api/app-client';

const MutationConfigs = {
  verifyEmail: (user: { email: string, isResetPassword?: boolean }) => {
    return appClient.post('/auth/verify-email', user);
  },
  verifyOtp: (user: { email: string, otp: string }) => {
    return appClient.post('/auth/verify-otp', user);
  },
  createUser: () => {
    return appClient.post('/users');
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
    return appClient.delete('/auth/logout');
  },
};

export default MutationConfigs;
