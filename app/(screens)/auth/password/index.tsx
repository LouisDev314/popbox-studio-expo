import { Button, SizableText, Spinner, Text } from 'tamagui';
import { Controller, useForm } from 'react-hook-form';
import PasswordInput from '@/components/Input/PasswordInput';
import React from 'react';
import { useAuth } from '@/context/auth-context';
import { passwordPattern } from '@/constants/patterns';
import { Keyboard } from 'react-native';

interface IPasswordScreenProps {
  email: string;
}

interface IPasswordForm {
  password: string;
  confirmPassword: string;
}

const PasswordScreen = (props: IPasswordScreenProps) => {
  const { control, handleSubmit, formState: { errors }, getValues } = useForm<IPasswordForm>();
  const { register, isRegisterPending } = useAuth();

  const onSubmit = (data: IPasswordForm) => {
    Keyboard.dismiss();
    register({ email: props.email, password: data.password });
  };

  return (
    <>
      {errors.password && <Text color="red">Between 8-30 characters</Text>}
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Password is required',
          validate: value => passwordPattern.test(value),
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            placeholder="Password"
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
          required: 'Please confirm your password',
          validate: value => value === getValues('password') || 'Passwords do not match',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            placeholder="Confirm password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            contextMenuHidden={true}
          />
        )}
      />
      {errors.confirmPassword && <Text color="red">{errors.confirmPassword.message}</Text>}

      <Button disabled={isRegisterPending} icon={isRegisterPending ? <Spinner /> : undefined}
              onPress={handleSubmit(onSubmit)}>
        <SizableText size={'$5'}>
          Register
        </SizableText>
      </Button>
    </>
  );
};

export default PasswordScreen;
