import React from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { secureStorage } from '@/utils/mmkv';
import { Button, Image } from 'tamagui';
import { StyleSheet } from 'react-native';

GoogleSignin.configure({
  webClientId: '308017225163-i826kctmutk5f0r4e4o9mse3lpnqijqq.apps.googleusercontent.com',
  iosClientId: '308017225163-5ke62fghtlreu9gjtv44eqhiuav654he.apps.googleusercontent.com',
});

const GoogleLoginScreen = () => {
  const handleSignIn = async () => {
    try {
      // Check if Play Services are available (Android only)
      await GoogleSignin.hasPlayServices();

      // Trigger Google Sign-In
      const userInfo = await GoogleSignin.signIn();

      // Get access and ID tokens
      const tokens = await GoogleSignin.getTokens();

      // Log user info and tokens for debugging
      console.log('User Info:', userInfo);
      console.log('Tokens:', tokens);
      secureStorage.set('googleTokens', JSON.stringify(tokens));

      // TODO: Navigate to home screen or pass tokens to your app state

    } catch (err) {
      console.log(err);
      // switch (error.code) {
      //   case statusCodes.SIGN_IN_CANCELLED:
      //     console.log('User cancelled the login flow');
      //     break;
      //   case statusCodes.IN_PROGRESS:
      //     console.log('Sign-in is already in progress');
      //     break;
      //   case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
      //     console.log('Google Play Services not available');
      //     break;
      //   default:
      //     console.error('Google Sign-In Error:', error);
      // }
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
