import { Card, CardProps, SizableText, YStack } from 'tamagui';
import { router } from 'expo-router';
import { AppScreen } from '@/enums/screens';
import CustomizeImage from '@/components/CustomizeImage';

interface IProductCardProps extends CardProps {
  id: string;
  title: string;
  images: string[];
  price: number;
  inventory?: number;
  originalPrice?: number; // For showing discounts
  currency?: string;
}

const ItemCard = (props: IProductCardProps) => {
  const { id, title, images, price, currency = '$', ...cardProps } = props;

  const formatPrice = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  const handleOnPress = () => {
    router.push({
      pathname: AppScreen.ProductDetail,
      params: {
        id,
      },
    });
  };

  return (
    <Card
      elevate
      bordered
      // backgroundColor="$background"
      animation="quick"
      borderRadius="$6"
      overflow="hidden"
      width="49%"
      // height={320}
      onPress={handleOnPress}
      pressStyle={{ scale: 0.95 }}
      {...cardProps}
    >
      {/* Image Container */}
      <Card.Header padding={0}>
        <YStack
          width="100%"
          height={200}
          overflow="hidden"
        >
          <CustomizeImage
            style={{ width: '100%', height: '100%' }}
            uri={images[0]}
          />
        </YStack>
      </Card.Header>

      {/* Content Container */}
      <YStack padding="$3" height={120}>
        {/* Title */}
        <SizableText
          // size="$4"
          fontWeight="300"
          fontSize="$3"
          ellipsizeMode="tail"
          numberOfLines={3}
          lineHeight="16"
        >
          {title}
        </SizableText>

        {/* Price Container */}
        <YStack marginTop="$2">
          <SizableText
            size="$7"
            fontWeight="500"
          >
            {formatPrice(price)}
          </SizableText>
        </YStack>
        {/*<XStack alignItems="center" marginTop="$2">*/}
        {/*  <SizableText*/}
        {/*    size="$6"*/}
        {/*    fontWeight="700"*/}
        {/*  >*/}
        {/*    {formatPrice(price)}*/}
        {/*  </SizableText>*/}

        {/*  {originalPrice && originalPrice > price && (*/}
        {/*    <SizableText*/}
        {/*      size="$3"*/}
        {/*      textDecorationLine="line-through"*/}
        {/*    >*/}
        {/*      {formatPrice(originalPrice)}*/}
        {/*    </SizableText>*/}
        {/*  )}*/}
        {/*</XStack>*/}
      </YStack>
    </Card>
  );
};

export default ItemCard;
