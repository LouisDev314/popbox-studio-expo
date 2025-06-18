import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Image, Separator, SizableText, Spinner, Text, XStack, YStack } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import { Keyboard, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import PasswordInput from '@/components/Input/PasswordInput';
import FormInput from '@/components/Input/FormInput';
import { router } from 'expo-router';
import { AppScreen } from '@/enums/screens';
import { useAuth } from '@/context/AuthContext';

interface ILoginFormProps {
  username: string;
  password: string;
}

const LoginScreen = () => {
  const [isFormValid, setIsFormValid] = useState(true);
  const { control, handleSubmit } = useForm<ILoginFormProps>();
  const { loginMutation } = useAuth();
  const { mutation: login, isPending } = loginMutation;

  const onSubmit = (data: ILoginFormProps) => {
    if (!data.username || !data.password) setIsFormValid(false);
    const loginForm =
      data.username.includes('@')
        ? { email: data.username, password: data.password }
        : { username: data.username, password: data.password };
    Keyboard.dismiss();
    login(loginForm);
  };

  return (
    <YStack padding="$4" style={{ ...styleSheet.yStack, ...AppStyleSheet.bg }}>
      <Image style={styleSheet.logoContainer} source={{
        uri: require('@/assets/images/logo.png'),
      }} />
      {!isFormValid && <Text color="red">Invalid username or password</Text>}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder="Username or email"
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
        onPress={() => console.log('forgot!')}
      >
        <Text color={'$blue10'}>
          Forgot password?
        </Text>
      </Button>

      <Button disabled={isPending} icon={isPending ? <Spinner /> : undefined} onPress={handleSubmit(onSubmit)}>
        <SizableText size={'$5'}>
          {isPending ? '' : 'Login'}
        </SizableText>
      </Button>

      <XStack style={styleSheet.xStack}>
        <SizableText size={'$4'}>
          Don't have an account yet?
        </SizableText>
        <Button unstyled color={Colors.primary} pressStyle={{ opacity: 0.5 }}
                onPress={() => router.navigate(AppScreen.RegisterInit)}>
          Sign Up
        </Button>
      </XStack>

      <XStack alignItems="center" marginTop={30} marginBottom={10}>
        <Separator />
        <SizableText size={'$5'} color="gray" marginHorizontal="13">or</SizableText>
        <Separator />
      </XStack>

      <Button unstyled pressStyle={{ opacity: 0.5 }}>
        <Image style={styleSheet.googleContainer} source={{
          uri: require('@/assets/images/google_logo.png'),
        }} />
      </Button>
    </YStack>
  );
};

const styleSheet = StyleSheet.create({
  logoContainer: {
    marginHorizontal: 'auto',
    width: 280,
    height: 150,
  },
  googleContainer: {
    marginHorizontal: 'auto',
    width: 30,
    height: 30,
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
