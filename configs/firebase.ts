import { initializeApp } from 'firebase/app';
import getEnvConfig from '@/configs/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

export const app = initializeApp(getEnvConfig().firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
