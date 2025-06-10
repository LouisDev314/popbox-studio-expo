import { IUser } from '@/app/models/user';
import appClient from '@/app/api/app-client';

export const MutationConfigs = {
  // verifyEmail: async (user: IVerifyEmail) => {
  //   return appClient.post('/auth/verifyEmail', user);
  // },
  // verifyEmailOtp: async (user: IVerifyOtp) => {
  //   return appClient.post('auth/verifyEmailOtp', user);
  // },
  // register: async (user: IRegisterUser) => {
  //   return appClient.post('/auth/register', user);
  // },
  login: async (user: Pick<IUser, 'username' | 'email'> & { password: string }) => {
    return appClient.post('/auth/login', user);
  },
  // logout: async () => {
  //   return appClient.delete('/auth/logout');
  // },
};
