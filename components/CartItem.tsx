import { Button, Card, CardProps, SizableText, View, XStack, YStack } from 'tamagui';
import CustomizeImage from '@/components/CustomizeImage';
import Colors from '@/constants/colors';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppScreen } from '@/enums/screens';
import { ICartItem } from '@/interfaces/cart';
import { useCart } from '@/context/cart-context';

interface ICartItemProps extends CardProps {
  item: ICartItem;
}

const CartItem = (props: ICartItemProps) => {
  const { handleRemoveCartItem } = useCart();

  const handleOnPress = () => {
    router.push({
      pathname: AppScreen.ProductDetail,
      params: {
        id: props.item.itemId,
        itemType: props.item.itemType,
      },
    });
  };

  return (
    <Card
      elevate
      bordered
      marginBottom="$2"
      animation="quick"
      borderRadius="$6"
      overflow="hidden"
      height={200}
      onPress={handleOnPress}
      pressStyle={{ scale: 0.95 }}
      {...props}
    >
      <XStack>
        {/* Image section */}
        <View
          width={150}
          height={200}
          overflow="hidden"
          paddingVertical="$4"
          paddingLeft="$3"
        >
          <CustomizeImage
            uri={props.item.images[0]}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 15,
            }}
          />
        </View>

        <Button
          unstyled
          size="$2"
          position="absolute"
          right={0}
          top="$2"
          onPress={() => handleRemoveCartItem(props.item)}>
          <Ionicons name="close-outline" color="grey" size={24} />
        </Button>

        {/* Content Section */}
        <YStack
          flex={1}
          padding="$4"
          justifyContent="space-between"
        >
          <View width="92%">
            {/* Top Content */}
            <SizableText
              size="$6"
              fontWeight="600"
              // numberOfLines={2}
              lineHeight={22}
            >
              {props.item.title}
            </SizableText>
          </View>

          {/* Bottom Action */}
          <View justifyContent="center" alignItems="center">
            <SizableText
              size="$7"
              fontWeight="700"
              color={Colors.primary}
            >
              ${props.item.price}
            </SizableText>
          </View>
        </YStack>

      </XStack>
    </Card>
  );
};

export default CartItem;
