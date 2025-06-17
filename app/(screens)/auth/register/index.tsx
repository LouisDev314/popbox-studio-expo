import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Image, SizableText, Spinner, Text, YStack } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import { MutationConfigs } from '@/api/configs/mutation-config';
import { Keyboard, StyleSheet, View } from 'react-native';
import FormInput from '@/components/Input/FormInput';
import { emailPattern } from '@/constants/patterns';
import { router } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { AppScreen } from '@/enums/screens';
import CustomizedHeaderBack from '@/components/CustomizedHeaderBack';
import ProgressIndicator from '@/components/ProgressIndicator';

interface IRegisterForm {
  email: string;
}

const RegisterInitScreen = () => {
  const [isFormValid, setIsFormValid] = useState(true);
  const [email, setEmail] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<IRegisterForm>();

  const { mutation: verifyEmailMutation, isPending } = useCustomizeMutation({
    mutationFn: MutationConfigs.verifyEmail,
    onSuccess: async () => {
      router.navigate({
        pathname: AppScreen.Otp,
        params: { email },
      });
    },
    onError: () => {
      console.log('error');
      setIsFormValid(false);
      // InfoAlert({ title: 'Invalid username or password', description: 'Please try again' });
    },
  });

  const onSubmit = (data: IRegisterForm) => {
    Keyboard.dismiss();
    router.navigate({
      pathname: AppScreen.Otp,
      params: { email },
    });
    setEmail(data.email);
    verifyEmailMutation(data.email);
  };

  const headerHeight = useHeaderHeight();

  return (
    <View style={AppStyleSheet.bg}>
      <YStack padding="$4" marginTop={-headerHeight} style={{ ...styleSheet.yStack, ...AppStyleSheet.bg }}>
        <CustomizedHeaderBack title="Login" />
        <Image style={styleSheet.logoContainer} source={{
          uri: require('@/assets/images/logo.png'),
        }} />
        {errors.email && <Text color="red">{errors.email.message}</Text>}
        {!isFormValid && <Text color="red">Email is already registered</Text>}
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

      </YStack>
      <ProgressIndicator currentStep={1} />
    </View>
  );
};

const styleSheet = StyleSheet.create({
  logoContainer: {
    marginHorizontal: 'auto',
    width: 280,
    height: 120,
  },
  yStack: {
    gap: 15,
    justifyContent: 'center',
  },
  indicator: {
    marginTop: 150,
  },
});

export default RegisterInitScreen;
