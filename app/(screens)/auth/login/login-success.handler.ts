import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';
import ITokens from '@/interfaces/tokens';
import { secureStorage } from '@/utils/mmkv';
import { setUser } from '@/hooks/use-user-store';
import { StorageKey } from '@/enums/storage';

const handleLoginSuccess = (data: AxiosResponse<IBaseApiResponse<{ user: IUser; tokens: ITokens }>>) => {
  const { tokens, user } = data.data.data;
  secureStorage.set(StorageKey.AccessToken, tokens.accessToken);
  secureStorage.set(StorageKey.RefreshToken, tokens.refreshToken);
  setUser(user);
};

export default handleLoginSuccess;
