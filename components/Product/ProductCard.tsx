import { Button, Card, CardProps, Image, SizableText, XStack } from 'tamagui';

interface IProductCardProps extends CardProps {
  title: string;
  image: string;
  price: number;
}

const ProductCard = (props: IProductCardProps) => {
  return (
    <Card elevate size="$4" bordered {...props}>
      <Card.Header padded>
        <SizableText>Text</SizableText>
      </Card.Header>
      <Card.Footer padded>
        <XStack flex={1} />
        <Button borderRadius="$10">Purchase</Button>
      </Card.Footer>
      <Card.Background>
        <Image
          alignSelf="center"
          source={{
            width: 300,
            height: 300,
            uri: '',
          }}
        />
      </Card.Background>
    </Card>
  );
};

export default ProductCard;
