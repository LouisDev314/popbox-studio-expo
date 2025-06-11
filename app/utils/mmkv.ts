import { MMKV } from 'react-native-mmkv';
import getEnvConfig from '@/app/configs/env';


export const storage = new MMKV();

export const secureStorage = new MMKV({
  id: 'secure',
  encryptionKey: getEnvConfig().encryptionKey,
});
