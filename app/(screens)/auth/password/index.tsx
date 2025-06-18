import { Button, SizableText, Spinner, Text } from 'tamagui';
import { Controller, useForm } from 'react-hook-form';
import PasswordInput from '@/components/Input/PasswordInput';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { passwordPattern } from '@/constants/patterns';
import { Keyboard } from 'react-native';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import { MutationConfigs } from '@/api/configs/mutation-config';

interface IPasswordScreenProps {
  email: string;
}

interface IPasswordForm {
  password: string;
  confirmPassword: string;
}

const PasswordScreen = (props: IPasswordScreenProps) => {
  const { control, handleSubmit, formState: { errors }, getValues } = useForm<IPasswordForm>();
  const { loginMutation } = useAuth();
  const { mutation: login, isPending } = loginMutation;

  const { mutation: register } = useCustomizeMutation({
    mutationFn: MutationConfigs.register,
    onSuccess: async () => {
      login({ email: props.email, password: getValues('password') });
    },
    onError: () => {
      console.log('error');
      // InfoAlert({ title: 'Invalid username or password', description: 'Please try again' });
    },
  });

  const onSubmit = (data: IPasswordForm) => {
    Keyboard.dismiss();
    register({ email: props.email, password: data.password });
  };

  return (
    <>
      {errors.password &&
        <>
          <Text color="red">Between 8-30 characters</Text>
          <Text color="red">Include 1 letter, 1 digit, and 1 special character</Text>
        </>}
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
          {isPending ? '' : 'Register'}
        </SizableText>
      </Button>
    </>
  );
};

export default PasswordScreen;
