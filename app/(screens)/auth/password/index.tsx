import { Button, SizableText, Spinner, Text } from 'tamagui';
import { Controller, useForm } from 'react-hook-form';
import PasswordInput from '@/components/Input/PasswordInput';
import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { passwordPattern } from '@/constants/patterns';
import { Keyboard } from 'react-native';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import MutationConfigs from '@/configs/api/mutation-config';
import { useLocalSearchParams } from 'expo-router';
import { HttpStatusCode } from 'axios';
import { storage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/storage';

interface IPasswordScreenProps {
  email: string;
}

interface IPasswordForm {
  password: string;
  confirmPassword: string;
}

const PasswordScreen = (props: IPasswordScreenProps) => {
  const { isForgotPassword } = useLocalSearchParams();
  const { control, handleSubmit, formState: { errors }, getValues } = useForm<IPasswordForm>();
  const { loginMutation } = useAuth();
  const { mutation: login, isPending: isLoginPending } = loginMutation;
  const [errMsg, setErrMsg] = useState('');

  const { mutation: register, isPending: isRegisterPending } = useCustomizeMutation({
    mutationFn: MutationConfigs.register,
    onSuccess: async () => {
      login({ email: props.email, password: getValues('password') });
    },
    onError: (err) => {
      setErrMsg(err.response?.data.message ?? 'Internal Server Error');
    },
  });

  const { mutation: resetPassword, isPending: isResetPasswordPending } = useCustomizeMutation({
    mutationFn: MutationConfigs.forgotPassword,
    onSuccess: async () => {
      storage.delete(StorageKey.OtpResetKey);
      login({ email: props.email, password: getValues('password') });
    },
    onError: (err) => {
      if (err.response?.data.code === HttpStatusCode.NotFound) setErrMsg(err.message);
    },
  });

  const onSubmit = (data: IPasswordForm) => {
    Keyboard.dismiss();
    if (isForgotPassword) {
      resetPassword({ email: props.email, password: data.password });
    } else {
      register({ email: props.email, password: data.password });
    }
  };

  const isPending = isLoginPending || isRegisterPending || isResetPasswordPending;
  const btnLabel = isForgotPassword ? 'Reset password' : 'Register';

  return (
    <>
      {errors.password &&
        <>
          <Text color="red">Between 8-30 characters</Text>
          <Text color="red">Include 1 letter, 1 digit, and 1 special character</Text>
        </>
      }
      {<Text color="red">{errMsg}</Text>}
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Password is required',
          validate: value => passwordPattern.test(value),
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: 'Please repeat your password',
          validate: value => value === getValues('password') || 'Passwords do not match',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            contextMenuHidden={true}
          />
        )}
      />
      {errors.confirmPassword && <Text color="red">{errors.confirmPassword.message}</Text>}

      <Button disabled={isPending} icon={isPending ? <Spinner /> : undefined} onPress={handleSubmit(onSubmit)}>
        <SizableText size={'$5'}>
          {isPending || isLoginPending ? '' : btnLabel}
        </SizableText>
      </Button>
    </>
  );
};

export default PasswordScreen;
