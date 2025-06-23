import React from 'react';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Button, Image } from 'tamagui';
import { StyleSheet } from 'react-native';
import getEnvConfig from '@/configs/env';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import { MutationConfigs } from '@/api/configs/mutation-config';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';
import ITokens from '@/interfaces/tokens';
import { router } from 'expo-router';
import handleLoginSuccess from '@/app/(screens)/auth/login/login-success.handler';

GoogleSignin.configure({
  // webClientId: getEnvConfig().webClientId,
  iosClientId: getEnvConfig().iosClientId,
  profileImageSize: 150,
});

const GoogleLoginScreen = () => {
  const { mutation: googleSignIn } = useCustomizeMutation({
    mutationFn: MutationConfigs.google,
    onSuccess: async (data: AxiosResponse<IBaseApiResponse<{ user: IUser; tokens: ITokens }>>) => {
      handleLoginSuccess(data);
      router.replace('/(tabs)');
    },
    onError: (err) => {
      console.log('err:', err.response?.data);
      // InfoAlert({ title: 'Invalid username or password', description: 'Please try again' });
    },
  });

  const handleSignIn = async () => {
    try {
      // Check if Play Services are available (Android only)
      await GoogleSignin.hasPlayServices();

      // Trigger Google Sign-In
      const res = await GoogleSignin.signIn();
      if (isSuccessResponse(res)) {
        const user = res.data.user;
        googleSignIn({ email: user.email, googleId: user.id });
      }
    } catch (err) {
      if (isErrorWithCode(err)) {
        switch (err.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Sign-in is already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Google Play Services not available');
            break;
          default:
            console.error('Google Sign-In Error:', err);
        }
      }
    }
  };

  return (
    <Button unstyled pressStyle={{ opacity: 0.5 }} onPress={handleSignIn}>
      <Image style={styles.container} source={{
        uri: require('@/assets/images/google_logo.png'),
      }} />
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    width: 30,
    height: 30,
  },
});

export default GoogleLoginScreen;
