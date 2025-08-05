import { Button } from 'tamagui';

const ProductDetails = () => {
  return (
    <Button
      size="$3"
      backgroundColor="$blue10"
      color="white"
      borderRadius="$3"
      fontWeight="600"
      marginTop="$2"
      pressStyle={{ backgroundColor: '$blue11' }}
      hoverStyle={{ backgroundColor: '$blue9' }}
    >
      Add to Cart
    </Button>
  );
};

export default ProductDetails;
