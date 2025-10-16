import React from 'react';
import { Alert, RefreshControl } from 'react-native';
import { ScrollView, SizableText, View } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import { useGetUser, useSetUser } from '@/hooks/use-user-store';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import CustomizeImage from '@/components/CustomizeImage';
import { useCart } from '@/context/cart-context';
import CartItem from '@/components/CartItem';

const Cart = () => {
  const user = useGetUser();
  const setUser = useSetUser();
  const { fetchCart, isFetchingCart } = useCart();
  const cart = user?.cart ?? [];

  // Calculate totals
  const subtotal = cart?.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // TODO: assign different taxes based on provinces
  const tax = subtotal * 0.05; // 5% GST
  // const shipping = subtotal > 199 ? 0 : 15.99; // Free shipping over $199
  const shipping = 0;
  const total = subtotal + tax + shipping;

  const updateQuantity = (id: string, newQuantity: number) => {
    const updatedCart = cart?.map(cartItem =>
      cartItem.itemId === id ? { ...cartItem, quantity: Math.max(1, newQuantity) } : cartItem,
    );
    const updatedUser = { ...user!, cart: updatedCart };
    setUser(updatedUser);
  };

  const handleCheckout = async () => {
    try {
      // Initialize Stripe checkout here
      // This is where you'd integrate with Stripe's payment sheet or checkout
      console.log('Initiating Stripe checkout with total:', total);

      // Example Stripe integration structure:
      /*
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Your Store Name",
        paymentIntentClientSecret: clientSecret, // Get from your backend
        defaultBillingDetails: {
          name: 'Customer Name',
        },
      });

      if (!error) {
        const { error } = await presentPaymentSheet();
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          Alert.alert('Success', 'Your payment was successful!');
        }
      }
      */

      Alert.alert('Checkout', 'Stripe checkout would be initiated here');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={AppStyleSheet.bg}>
      {/* Header */}
      <View width="100%" alignItems="center" justifyContent="center" marginTop={60}>
        <SizableText size="$8" fontWeight="bold">Shopping Cart</SizableText>
      </View>

      {/* Cart Items */}
      <ScrollView
        height="100%"
        marginTop="$4"
        refreshControl={
          <RefreshControl
            refreshing={isFetchingCart}
            onRefresh={fetchCart}
            tintColor="white"
          />
        }
      >
        {!cart?.length ? (
          <View marginTop={SCREEN_HEIGHT / 5} alignItems="center">
            <CustomizeImage
              source={require('@/assets/images/empty-cart.png')}
              style={{
                width: 200,
                height: 200,
              }}
            />
            <SizableText size="$7" marginTop="$4" fontWeight="500">Your cart is empty</SizableText>
          </View>
        ) : (
          <>
            {cart?.map((item) => (
              <CartItem key={item.itemId} item={item} updateQuantity={updateQuantity} />
            ))}
          </>
        )}
      </ScrollView>

    </View>
  );
};

export default Cart;
