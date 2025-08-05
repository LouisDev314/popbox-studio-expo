import { Card, CardProps, Image, SizableText, YStack } from 'tamagui';
import { ImageURISource } from 'react-native';

interface IProductCardProps extends CardProps {
  title: string;
  images: ImageURISource[];
  price: number;
  inventory?: number;
  originalPrice?: number; // For showing discounts
  currency?: string;
}

const ProductCard = (props: IProductCardProps) => {
  const { title, images, price, currency = '$', ...cardProps } = props;

  const formatPrice = (amount: number) => {
    return `${currency}${amount.toFixed(2)}`;
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
      pressStyle={{ scale: 0.875 }}
      {...cardProps}
    >
      {/* Image Container */}
      <Card.Header padding={0}>
        <YStack
          width="100%"
          height={200}
          overflow="hidden"
        >
          <Image
            source={images[0]}
            width="100%"
            height="100%"
            objectFit="cover"
            borderRadius={0}
          />
        </YStack>
      </Card.Header>

      {/* Content Container */}
      <YStack padding="$3" height={120}>
        {/* Title */}
        <SizableText
          size="$4"
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

export default ProductCard;
