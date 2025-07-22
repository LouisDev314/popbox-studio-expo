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
  sendOtp: (email: string) => {
    return appClient.post('/auth/send-otp', { email });
  },
};

export default MutationConfigs;
