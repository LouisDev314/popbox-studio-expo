import React, { useEffect, useState } from 'react';
import { Button, Image, Text, YStack } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import { MutationConfigs } from '@/api/configs/mutation-config';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '@/constants/colors';
import CustomizedHeaderBack from '@/components/CustomizedHeaderBack';
import ProgressIndicator from '@/components/ProgressIndicator';
import { OtpInput } from 'react-native-otp-entry';

const OtpScreen = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(true);

  const { mutation: verifyOtpMutation, isPending } = useCustomizeMutation({
    mutationFn: MutationConfigs.verifyOtp,
    onSuccess: async () => {
      // TODO: go to the password screen
    },
    onError: () => {
      console.log('error');
      setIsOtpValid(false);
      // InfoAlert({ title: 'Invalid username or password', description: 'Please try again' });
    },
  });

  const onSubmit = (otp: string) => {
    Keyboard.dismiss();
    verifyOtpMutation({ email, otp });
  };

  useEffect(() => {
    if (otp) onSubmit(otp);
  }, [otp]);

  const headerHeight = -useHeaderHeight();

  return (
    <View style={AppStyleSheet.bg}>
      <YStack padding="$4" marginTop={headerHeight} style={{ ...styleSheet.yStack, ...AppStyleSheet.bg }}>
        <CustomizedHeaderBack title="Verify Email" />
        <Image style={styleSheet.logoContainer} source={{
          uri: require('@/assets/images/logo.png'),
        }} />
        {!isOtpValid && <Text color="red">OTP is invalid</Text>}
        <OtpInput
          numberOfDigits={6}
          focusColor={Colors.primary}
          type="numeric"
          textProps={{}}
          theme={{
            pinCodeContainerStyle: { width: 50 },
            pinCodeTextStyle: { color: 'white' },
            filledPinCodeContainerStyle: { borderColor: Colors.primary },
          }}
          onFilled={(otp) => setOtp(otp)}
        />
        <Button
          unstyled
          alignItems="flex-end"
          pressStyle={{ opacity: 0.5 }}
          onPress={() => console.log('resend otp')}
        >
          <Text color={Colors.primary}>
            Resend OTP
          </Text>
        </Button>
      </YStack>
      <ProgressIndicator currentStep={2} />
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
});

export default OtpScreen;
