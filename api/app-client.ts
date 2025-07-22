import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import getEnvConfig from '@/configs/env';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/storage';
import { auth } from '@/configs/firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signOut } from 'firebase/auth';
import { clearUser } from '@/hooks/use-user-store';
import { router } from 'expo-router';
import { AppScreen } from '@/enums/screens';
import { Alert } from 'react-native';

const appClient: AxiosInstance = axios.create({
  baseURL: getEnvConfig().apiBaseUrl,
  timeout: 10000,
  timeoutErrorMessage: 'timeout of 10000 ms exceeded',
});

const handleLogout = async () => {
  try {
    // Sign out from Google
    await GoogleSignin.signOut();
    // Sign out from Firebase
    await signOut(auth);
    // Clear stored user data
    clearUser();
    secureStorage.clearAll();
    router.replace(AppScreen.Login);
  } catch (err) {
    console.error('Logout error:', err);
  }
};

appClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  config.headers['device-id'] = secureStorage.getString(StorageKey.DeviceId);

  try {
    const token = await auth.currentUser?.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  } catch (err) {
    Alert.alert(
      'Oops, Something Went Wrong',
      'For your security, you’ve been logged out. Please sign in again.',
      [
        {
          text: 'OK',
          style: 'destructive', // Makes the button red on iOS (treated like a "critical/important" action)
        },
      ],
    );
    await handleLogout();
  }

  return config;
});

export default appClient;
