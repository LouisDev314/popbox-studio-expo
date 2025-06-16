import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Image, Input, Separator, SizableText, Spinner, Text, XStack, YStack } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import { emailPattern, usernamePattern } from '@/constants/patterns';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import { MutationConfigs } from '@/api/configs/mutation-config';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';
import ITokens from '@/interfaces/tokens';
import { secureStorage } from '@/utils/mmkv';
import { setUser } from '@/hooks/use-user-store';
import { Keyboard, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface ILoginForm {
  username: string;
  password: string;
}

const LoginScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<ILoginForm>();

  const { mutation: loginMutation, isPending } = useCustomizeMutation({
    mutationFn: MutationConfigs.login,
    onSuccess: async (data: AxiosResponse<IBaseApiResponse<{ user: IUser; tokens: ITokens }>>) => {
      const { tokens, user } = data.data.data;
      secureStorage.set('accessToken', tokens.accessToken);
      secureStorage.set('refreshToken', tokens.refreshToken);
      setUser(user);
    },
    onError: () => {
      console.log('error');
      // InfoAlert({ title: 'Invalid username or password', description: 'Please try again' });
    },
  });

  const login = (user: { email: string, password: string } | { username: string, password: string }) => {
    Keyboard.dismiss();
    loginMutation(user);
  };

  const onSubmit = (data: ILoginForm) => {
    const loginForm =
      data.username.includes('@')
        ? { email: data.username, password: data.password }
        : { username: data.username, password: data.password };
    login(loginForm);
  };

  return (
    <YStack flex={1} padding="$4" justifyContent="center" style={{ ...styleSheet.yStack, ...AppStyleSheet.bg }}>
      <Image style={styleSheet.logoContainer} source={{
        uri: require('@/assets/images/logo.png'),
      }} />
      <Controller
        control={control}
        name="username"
        rules={{
          required: 'Username or email is required',
          validate: value =>
            usernamePattern.test(value) || emailPattern.test(value)
              ? true
              : 'Enter a valid username or email address',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Username or email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      {errors.username && <Text color="red">{errors.username.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text color="red">{errors.password.message}</Text>}

      <Button
        unstyled
        alignItems="flex-end"
        onPress={() => console.log('forgot!')}
      >
        <Text color={'$blue10'}>
          {/* TODO: bold on press*/}
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
        {/* TODO: bold on press*/}
        <Button color={Colors.primary} unstyled>Sign Up</Button>
      </XStack>

      <XStack alignItems="center" marginTop={30} marginBottom={10}>
        <Separator />
        <SizableText size={'$5'} color="gray" marginHorizontal="13">or</SizableText>
        <Separator />
      </XStack>

      <Button unstyled>
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
    backgroundColor: '$blue10',
  },
  yStack: {
    gap: 15,
  },
  xStack: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
});

export default LoginScreen;
