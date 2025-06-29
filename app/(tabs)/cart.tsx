import { Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';

const Cart = () => {
  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Text>Shopping cart</Text>
    </SafeAreaView>
  );
};

export default Cart;
