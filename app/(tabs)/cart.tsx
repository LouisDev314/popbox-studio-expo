import React, { useRef } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { ScrollView, SizableText, View } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import { useGetUser, useSetUser } from '@/hooks/use-user-store';
import BottomSheet, { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import CustomizeImage from '@/components/CustomizeImage';
import { useCart } from '@/context/cart-context';
import CartItem from '@/components/CartItem';

const Cart = () => {
  const user = useGetUser();
  const setUser = useSetUser();
  const { fetchCart, isFetchingCart } = useCart();

  const bottomSheetRef = useRef<BottomSheet>(null);

  // Calculate totals
  const subtotal = Array.from(user?.cart?.values() ?? []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // TODO: assign different taxes based on provinces
  const tax = subtotal * 0.05; // 5% GST
  // const shipping = subtotal > 199 ? 0 : 15.99; // Free shipping over $199
  const shipping = 0;
  const total = subtotal + tax + shipping;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (!user?.cart) return;
    // Create a shallow copy of the cart Map to maintain immutability
    const updatedCart = new Map(user.cart);
    const existingItem = updatedCart.get(itemId);
    if (existingItem) {
      updatedCart.set(itemId, { ...existingItem, quantity: Math.max(1, newQuantity) });
    }
    const updatedUser = { ...user, cart: updatedCart };
    setUser(updatedUser);
  };

  // const handleCheckout = async () => {
  //   try {
  //     // Initialize Stripe checkout here
  //     // This is where you'd integrate with Stripe's payment sheet or checkout
  //     console.log('Initiating Stripe checkout with total:', total);
  //
  //     // Example Stripe integration structure:
  //     /*
  //     const { error } = await initPaymentSheet({
  //       merchantDisplayName: "Your Store Name",
  //       paymentIntentClientSecret: clientSecret, // Get from your backend
  //       defaultBillingDetails: {
  //         name: 'Customer Name',
  //       },
  //     });
  //
  //     if (!error) {
  //       const { error } = await presentPaymentSheet();
  //       if (error) {
  //         Alert.alert(`Error code: ${error.code}`, error.message);
  //       } else {
  //         Alert.alert('Success', 'Your payment was successful!');
  //       }
  //     }
  //     */
  //
  //     Alert.alert('Checkout', 'Stripe checkout would be initiated here');
  //   } catch (error) {
  //     Alert.alert('Error', 'Something went wrong. Please try again.');
  //   }
  // };

  return (
    <View style={AppStyleSheet.bg}>
      {/* Header */}
      <View width="100%" alignItems="center" justifyContent="center" marginTop={60}>
        <SizableText size="$8" fontWeight="bold">Shopping Cart</SizableText>
      </View>

      {/* Cart Items */}
      <ScrollView
        // height="50%"
        height={800}
        marginTop="$4"
        refreshControl={
          <RefreshControl
            refreshing={isFetchingCart}
            onRefresh={fetchCart}
            tintColor="white"
          />
        }
      >
        {!user?.cart?.size ? (
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
            {Array.from(user?.cart?.values()).map((item) => (
              <CartItem key={item.itemId} item={item} updateQuantity={updateQuantity} />
            ))}
          </>
        )}
      </ScrollView>
      {/*<BottomSheet*/}
      {/*  style={styles.container}*/}
      {/*  ref={bottomSheetRef}*/}
      {/*  snapPoints={['25%']}*/}
      {/*  handleComponent={null}*/}
      {/*  enableHandlePanningGesture={false} // Prevent drag resize*/}
      {/*  enableContentPanningGesture={false} // Prevent drag from content*/}
      {/*  enableDynamicSizing={false}*/}
      {/*>*/}
      {/*  <BottomSheetView*/}
      {/*    style={styles.content}*/}
      {/*  >*/}
      {/*    <Text>Awesome 🎉</Text>*/}
      {/*  </BottomSheetView>*/}
      {/*</BottomSheet>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
  },
  content: {
    backgroundColor: 'grey',
  },
});

export default Cart;
