import { Button, SizableText, XStack, XStackProps } from 'tamagui';
import React from 'react';

interface ICartProps {
  setQuantity: (value: number) => void;
  quantity: number;
  style?: XStackProps['style'];
  btnSize?: number;
  textSize?: number;
  customOnPlusPress?: () => void;
}

const QuantitySelector = (props: ICartProps) => {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      style={props.style}
    >
      <Button
        size={`$${props.btnSize ?? 4}`}
        onPress={() => props.setQuantity(Math.max(1, props.quantity - 1))}
      >
        <SizableText size="$8">-</SizableText>
      </Button>
      <SizableText size={`$${props.textSize ?? 7}`} textAlign="center" minWidth="$1">{props.quantity}</SizableText>
      <Button
        size={`$${props.btnSize ?? 4}`}
        onPress={props.customOnPlusPress ?? (() => props.setQuantity(props.quantity + 1))}
      >
        <SizableText size="$8">+</SizableText>
      </Button>
    </XStack>
  );
};

export default QuantitySelector;
