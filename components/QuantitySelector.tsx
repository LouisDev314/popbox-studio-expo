import { Button, SizableText, XStack, XStackProps } from 'tamagui';
import React, { Dispatch, SetStateAction } from 'react';

interface ICartProps {
  setQuantity: Dispatch<SetStateAction<number>>;
  quantity: number;
  style?: XStackProps['style'];
}

const QuantitySelector = (props: ICartProps) => {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      style={props.style}
    >
      <Button
        onPress={() => props.setQuantity(prev => Math.max(1, prev - 1))}
      >
        <SizableText size="$8">-</SizableText>
      </Button>
      <SizableText size="$7">{props.quantity}</SizableText>
      <Button
        onPress={() => props.setQuantity(prev => prev + 1)}
      >
        <SizableText size="$8">+</SizableText>
      </Button>
    </XStack>
  );
};

export default QuantitySelector;
