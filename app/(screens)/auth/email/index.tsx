import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, SizableText, Spinner, Text } from 'tamagui';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import MutationConfigs from '@/configs/api/mutation-config';
import { Alert, Keyboard } from 'react-native';
import FormInput from '@/components/Input/FormInput';
import { emailPattern } from '@/constants/patterns';
import { Step } from '@/enums/register-step';
import { router, useLocalSearchParams } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/configs/firebase';

interface IEmailFormProps {
  email: string;
  setStep: (step: Step) => void;
  setEmail: (email: string) => void;
  setHideProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmailScreen = (props: IEmailFormProps) => {
  const { isForgotPassword } = useLocalSearchParams();
  const [isFormValid, setIsFormValid] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (!!isForgotPassword) props.setHideProgress(true);
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<IEmailFormProps>();

  const handleForgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Check Your Email',
        'If an account is registered with that email, a password reset link has been sent. Please check your inbox and spam folder.',
        [
          {
            text: 'Back to Login',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (err) {
      console.error(err);
    }
  };

  const { mutation: verifyEmail, isPending } = useCustomizeMutation({
    mutationFn: MutationConfigs.verifyEmail,
    onSuccess: async () => {
      if (!!isForgotPassword) {
        await handleForgotPassword(props.email);
      } else {
        props.setStep(Step.Otp);
      }
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
    verifyEmail({ email: data.email, isResetPassword: !!isForgotPassword });
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
