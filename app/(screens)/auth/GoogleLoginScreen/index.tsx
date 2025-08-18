import React, { useCallback } from 'react';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { Button, Image } from 'tamagui';
import { StyleSheet } from 'react-native';
import getEnvConfig from '@/configs/env';
import { getAdditionalUserInfo, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/configs/firebase';
import { useAuth } from '@/context/auth-context';

GoogleSignin.configure({
  webClientId: getEnvConfig().webClientId,
  iosClientId: getEnvConfig().iosClientId,
  offlineAccess: true,
});

const GoogleLoginScreen = () => {
  const { createUser, fetchUser } = useAuth();

  const loginWithGoogle = useCallback(async () => {
    try {
      // Check if Play Services are available (Android only)
      await GoogleSignin.hasPlayServices();

      // Trigger Google Sign-In
      const res = await GoogleSignin.signIn();
      if (isSuccessResponse(res)) {
        const googleCredential = GoogleAuthProvider.credential(res.data.idToken);
        const result = await signInWithCredential(auth, googleCredential);

        const additionalInfo = getAdditionalUserInfo(result);
        if (additionalInfo?.isNewUser) {
          createUser({}); // Create new user in backend
        } else {
          await fetchUser(); // Fetch existing user data
        }
      }
    } catch (err) {
      console.error('Google sign in error:', err);
    }
  }, []);

  return (
    <Button style={styles.btnContainer} unstyled pressStyle={{ opacity: 0.5 }} onPress={loginWithGoogle}>
      <Image style={styles.imgContainer} source={{
        uri: require('@/assets/images/google_logo.png'),
      }} />
    </Button>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    marginHorizontal: 'auto',
    width: 40,
    height: 40,
  },
  imgContainer: {
    marginHorizontal: 'auto',
    width: 30,
    height: 30,
  },
});

export default GoogleLoginScreen;
