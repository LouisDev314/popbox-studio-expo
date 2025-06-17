import React, { useState } from 'react';
import { Button, GetProps, Input, XStack } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';

type IPasswordInputProps = GetProps<typeof Input>;

const PasswordInput = (props: IPasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <XStack alignItems="center" width="100%">
      <Input
        {...props}
        flex={1}
        secureTextEntry={!show}
        placeholder="Password"
      />
      <Button
        unstyled
        onPress={() => setShow((show) => !show)}
        position="absolute"
        right={15}
        backgroundColor="transparent"
        pressStyle={{ opacity: 0.5 }}
        icon={show ? <Ionicons name="eye-outline" color="white" size={20} /> :
          <Ionicons name="eye-off-outline" color="white" size={20} />}
      />
    </XStack>
  );
};

export default PasswordInput;
