import React, { useEffect, useState } from 'react';
import { Button, Text } from 'tamagui';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import MutationConfigs from '@/configs/api/mutation-config';
import { Keyboard } from 'react-native';
import Colors from '@/constants/colors';
import { OtpInput } from 'react-native-otp-entry';
import { Step } from '@/enums/register-step';
import { storage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/storage';

interface IOtpScreenProps {
  email: string;
  setStep: (step: Step) => void;
}

const OtpScreen = (props: IOtpScreenProps) => {
  const [otp, setOtp] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const initTimer = () => {
      const savedTimer = storage.getString(StorageKey.OtpTimer);
      if (savedTimer) {
        const { startTime, duration } = JSON.parse(savedTimer);
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = duration - elapsed;
        if (remaining > 0) {
          setRemainingTime(remaining);
          setIsTimerActive(true);
        } else {
          // Timer has expired
          setIsTimerActive(false);
          storage.delete(StorageKey.OtpTimer);
        }
      } else {
        sendOtpMutation(props.email);
      }
    };
    initTimer();
  }, []);

  const startNewTimer = () => {
    const duration = 59;
    const startTime = Date.now();
    const timerState = { startTime, duration };
    storage.set(StorageKey.OtpTimer, JSON.stringify(timerState));
    setRemainingTime(duration);
    setIsTimerActive(true);
  };

  useEffect(() => {
    if (isTimerActive) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            setIsTimerActive(false);
            storage.delete(StorageKey.OtpTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerActive]);

  useEffect(() => {
    if (otp) onSubmit(otp);
  }, [otp]);

  const { mutation: verifyOtp } = useCustomizeMutation({
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

  const { mutation: sendOtpMutation } = useCustomizeMutation({
    mutationFn: MutationConfigs.sendOtp,
    onError: () => {
      console.log('failed to resendOtp');
    },
  });

  const onSubmit = (otp: string) => {
    Keyboard.dismiss();
    verifyOtp({ email: props.email, otp });
  };

  const sendOtp = () => {
    startNewTimer();
    sendOtpMutation(props.email);
  };

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
        disabled={isTimerActive}
        alignItems="flex-end"
        pressStyle={{ opacity: 0.5 }}
        onPress={sendOtp}
      >
        <Text color={Colors.primary}>
          {isTimerActive ? `${remainingTime}(s)` : 'Resend OTP'}
        </Text>
      </Button>
    </>
  );
};

export default OtpScreen;
