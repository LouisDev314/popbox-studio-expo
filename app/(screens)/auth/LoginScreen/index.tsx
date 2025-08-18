import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Image, Separator, SizableText, Spinner, Text, XStack, YStack } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import { Keyboard, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import PasswordInput from '@/components/Input/PasswordInput';
import FormInput from '@/components/Input/FormInput';
import { router, useNavigation } from 'expo-router';
import { AppScreen } from '@/enums/screens';
import GoogleLoginScreen from '@/app/(screens)/auth/GoogleLoginScreen';
import { useAuth } from '@/context/auth-context';

interface ILoginFormProps {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const [isFormValid, setIsFormValid] = useState(true);
  const { control, handleSubmit, reset } = useForm<ILoginFormProps>();
  const { isError, isFetchingUser, login, isLoginPending, resetLogin } = useAuth();

  const navigation = useNavigation();
  useEffect(() => {
    return navigation.addListener('blur', () => {
      reset();
      setIsFormValid(true);
      resetLogin();
    });
  }, [navigation, reset]);

  // TODO: use activity indicator
  const isLoading = isFetchingUser || isLoginPending;

  const onSubmit = (data: ILoginFormProps) => {
    Keyboard.dismiss();
    if (!data.email || !data.password) setIsFormValid(false);
    else login({ email: data.email, password: data.password });
  };

  return (
    <YStack padding="$4" style={{ ...styles.yStack, ...AppStyleSheet.bg }}>
      <Image style={styles.logoContainer} source={{
        uri: require('@/assets/images/logo.png'),
      }} />
      {(!isFormValid || isError) && <Text color="red">
        Invalid username or password
      </Text>}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Button
        unstyled
        alignItems="flex-end"
        pressStyle={{ opacity: 0.5 }}
        onPress={() => router.navigate({
          pathname: AppScreen.VerifyEmail,
          params: { isForgotPassword: 'true' },
        })}
      >
        <Text color="$blue10">
          Forgot password?
        </Text>
      </Button>

      <Button disabled={isLoading} icon={isLoading ? <Spinner /> : undefined} onPress={handleSubmit(onSubmit)}>
        <SizableText size="$5">
          {isLoading ? '' : 'Login'}
        </SizableText>
      </Button>

      <XStack style={styles.xStack}>
        <SizableText size="$4">
          Don't have an account yet?
        </SizableText>
        <Button unstyled color={Colors.primary} pressStyle={{ opacity: 0.5 }}
                onPress={() => router.navigate(AppScreen.VerifyEmail)}>
          Sign Up
        </Button>
      </XStack>

      <XStack alignItems="center" marginTop={30} marginBottom={10}>
        <Separator />
        <SizableText size="$5" color="gray" marginHorizontal="13">or</SizableText>
        <Separator />
      </XStack>

      <GoogleLoginScreen />
    </YStack>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    marginHorizontal: 'auto',
    width: 280,
    height: 150,
  },
  yStack: {
    gap: 15,
    justifyContent: 'center',
  },
  xStack: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});

export default LoginScreen;
