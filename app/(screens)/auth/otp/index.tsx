import React, { useEffect, useState } from 'react';
import { Button, Text } from 'tamagui';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import { MutationConfigs } from '@/api/configs/mutation-config';
import { Keyboard } from 'react-native';
import Colors from '@/constants/colors';
import { OtpInput } from 'react-native-otp-entry';
import { Step } from '@/enums/register-step';

interface IOtpScreenProps {
  email: string;
  setStep: (step: Step) => void;
}

const OtpScreen = (props: IOtpScreenProps) => {
  const [otp, setOtp] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(true);

  const { mutation: verifyOtpMutation } = useCustomizeMutation({
    mutationFn: MutationConfigs.verifyOtp,
    onSuccess: async () => {
      props.setStep(Step.Password);
    },
    onError: () => {
      console.log('error');
      setIsOtpValid(false);
      // InfoAlert({ title: 'Invalid username or password', description: 'Please try again' });
    },
  });

  const onSubmit = (otp: string) => {
    Keyboard.dismiss();
    verifyOtpMutation({ email: props.email, otp });
  };

  useEffect(() => {
    if (otp) onSubmit(otp);
  }, [otp]);

  return (
    <>
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
        {/* TODO: timer count down */}
        <Text color={Colors.primary}>
          Resend OTP
        </Text>
      </Button>
    </>
  );
};

export default OtpScreen;
