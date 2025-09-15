import { Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';
import { StyleSheet } from 'react-native';

const Cart = () => {
  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Text>Shopping cart</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default Cart;
