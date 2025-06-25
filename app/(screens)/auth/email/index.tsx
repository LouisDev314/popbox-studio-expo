import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, SizableText, Spinner, Text } from 'tamagui';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import { MutationConfigs } from '@/api/configs/mutation-config';
import { Keyboard } from 'react-native';
import FormInput from '@/components/Input/FormInput';
import { emailPattern } from '@/constants/patterns';
import { Step } from '@/enums/register-step';

interface IEmailFormProps {
  email: string;
  setStep: (step: Step) => void;
  setEmail: (email: string) => void;
}

const EmailScreen = (props: IEmailFormProps) => {
  const [isFormValid, setIsFormValid] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<IEmailFormProps>();

  const { mutation: verifyEmail, isPending } = useCustomizeMutation({
    mutationFn: MutationConfigs.verifyEmail,
    onSuccess: async () => {
      props.setStep(Step.Otp);
    },
    onError: (err) => {
      setErrMsg(err.response?.data.message ?? 'Invalid credentials');
      setIsFormValid(false);
      // InfoAlert({ title: 'Invalid username or password', description: 'Please try again' });
    },
  });

  const onSubmit = (data: IEmailFormProps) => {
    Keyboard.dismiss();
    props.setEmail(data.email);
    verifyEmail(data.email);
  };

  return (
    <>
      {errors.email && <Text color="red">{errors.email.message}</Text>}
      {!isFormValid && <Text color="red">{errMsg}</Text>}
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required',
          validate: value => emailPattern.test(value)
            ? true
            : 'Enter a valid email address',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder="Enter your email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      <Button disabled={isPending} icon={isPending ? <Spinner /> : undefined} onPress={handleSubmit(onSubmit)}>
        <SizableText size={'$5'}>
          {isPending ? '' : 'Verify email'}
        </SizableText>
      </Button>
    </>
  );
};

export default EmailScreen;
