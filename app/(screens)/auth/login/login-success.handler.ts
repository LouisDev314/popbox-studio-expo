import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';
import ITokens from '@/interfaces/tokens';
import { secureStorage } from '@/utils/mmkv';
import { setAuthHeader } from '@/utils/auth-header';
import { setUser } from '@/hooks/use-user-store';

const handleLoginSuccess = (data: AxiosResponse<IBaseApiResponse<{ user: IUser; tokens: ITokens }>>) => {
  const { tokens, user } = data.data.data;
  secureStorage.set('accessToken', tokens.accessToken);
  secureStorage.set('refreshToken', tokens.refreshToken);
  setAuthHeader(tokens.accessToken);
  setUser(user);
};

export default handleLoginSuccess;
