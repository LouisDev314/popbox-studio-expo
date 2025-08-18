import React, { useState } from 'react';
import { Image, YStack } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import { StyleSheet, View } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import CustomizeHeaderBack from '@/components/CustomizeHeaderBack';
import ProgressIndicator from '@/components/ProgressIndicator';
import EmailScreen from '@/app/(screens)/auth/EmailScreen';
import OtpScreen from '@/app/(screens)/auth/OtpScreen';
import PasswordScreen from '@/app/(screens)/auth/PasswordScreen';
import { RegisterStep } from '@/enums/register-step';

const RegisterInitScreen = () => {
  const [step, setStep] = useState<RegisterStep>(RegisterStep.Email);
  const [email, setEmail] = useState('');
  const [hideProgress, setHideProgress] = useState(false);

  const headerHeight = useHeaderHeight();

  let currentScreen;
  switch (step) {
    case RegisterStep.Email:
      currentScreen =
        <EmailScreen setEmail={setEmail} email={email} setStep={setStep} setHideProgress={setHideProgress} />;
      break;
    // Only RegisterInitScreen will continue in following Steps
    case RegisterStep.Otp:
      currentScreen = <OtpScreen email={email} setStep={setStep} />;
      break;
    case RegisterStep.Password:
      currentScreen = <PasswordScreen email={email} />;
      break;
  }

  return (
    <View style={AppStyleSheet.bg}>
      <YStack padding="$4" marginTop={-headerHeight} style={{ ...styleSheet.yStack, ...AppStyleSheet.bg }}>
        <CustomizeHeaderBack title="Login" />
        <Image style={styleSheet.logoContainer} source={{
          uri: require('@/assets/images/logo.png'),
        }} />
        {currentScreen}
      </YStack>
      <ProgressIndicator currentStep={step} hide={hideProgress} />
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
