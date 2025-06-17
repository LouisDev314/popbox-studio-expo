import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Circle, XStack } from 'tamagui';

interface IProgressIndicator {
  currentStep: number;
}

const ProgressIndicator = (props: IProgressIndicator) => {
  const steps = [1, 2, 3];
  return (
    <XStack style={styles.container}>
      {steps.map((step) => (
        <Circle
          key={step}
          size={12}
          backgroundColor={Colors.primary}
          style={[
            step === props.currentStep ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </XStack>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginBottom: 35,
    gap: 20,
  },
  activeDot: {
    backgroundColor: Colors.primary, // Highlight the current step
  },
  inactiveDot: {
    backgroundColor: 'gray', // Dim the other steps
  },
});

export default ProgressIndicator;
