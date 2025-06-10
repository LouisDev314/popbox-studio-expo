import { useLocalSearchParams } from 'expo-router';
import { SizableText } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductDetails = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <SizableText>{id}</SizableText>
    </SafeAreaView>
  );
};

export default ProductDetails;
