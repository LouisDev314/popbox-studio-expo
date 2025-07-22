import React from 'react';
import { Button, GetProps, Input, XStack } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IFormInputProps = GetProps<typeof Input>;

interface IFormInput extends IFormInputProps {
  placeholder: string;
}

const FormInput = (props: IFormInput) => {
  return (
    <XStack alignItems="center" width="100%">
      <Input
        {...props}
        flex={1}
        placeholder={props.placeholder}
        autoComplete="off"
      />
      <Button
        unstyled
        onPress={() => {
          if (props.onChangeText) props.onChangeText('');
        }}
        position="absolute"
        right={15}
        backgroundColor="transparent"
        pressStyle={{ opacity: 0.5 }}
        icon={props.value ? <Ionicons name="close-outline" color="white" size={20} /> :
          undefined}
      />
    </XStack>
  );
};

export default FormInput;
