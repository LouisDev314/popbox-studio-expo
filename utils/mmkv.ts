import { MMKV } from 'react-native-mmkv';
import getEnvConfig from '@/configs/env';
import * as Keychain from 'react-native-keychain';

const retrieveKey = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: getEnvConfig().encryptionKey });
    if (credentials) {
      return credentials.password;
    } else {
      const newKey = generateRandomKey(32); // Use crypto or a secure random generator
      await Keychain.setGenericPassword(getEnvConfig().encryptionKey, newKey, { service: getEnvConfig().encryptionKey });
      return newKey;
    }
  } catch (err) {
    console.error('Failed to initialize MMKV secure storage:', err);
  }
};

const generateRandomKey = (length: number) => {
  const array = new Uint8Array(length);
  // Polyfill for crypto.getRandomValues in React Native
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
};

let _secureStorage: MMKV | null = null;

export const initializeSecureStorage = async () => {
  if (_secureStorage) {
    return _secureStorage;
  }
  const encryptionKey = await retrieveKey();
  _secureStorage = new MMKV({
    id: 'mmkv-secure-storage',
    encryptionKey: encryptionKey,
  });

  return _secureStorage;
};

export const secureStorage = () => {
  if (!_secureStorage) {
    throw new Error('MMKV Secure Storage not initialized. Call initializeSecureStorage first.');
  }
  return _secureStorage;
};
