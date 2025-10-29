import React, { useRef, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { Button, ScrollView, SizableText, View, XStack, YStack } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import { useGetUser, useSetUser } from '@/hooks/use-user-store';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import CustomizeImage from '@/components/CustomizeImage';
import { useCart } from '@/context/cart-context';
import CartItem from '@/components/CartItem';
import Colors from '@/constants/colors';
import { AntDesign } from '@expo/vector-icons';

const Cart = () => {
  const user = useGetUser();
  const setUser = useSetUser();
  const { fetchCart, isFetchingCart } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleExpand = () => {
    bottomSheetRef.current?.snapToIndex(1);
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    bottomSheetRef.current?.snapToIndex(0);
    setIsExpanded(false);
  };

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
      <BottomSheet
        style={styles.container}
        backgroundStyle={styles.background}
        ref={bottomSheetRef}
        snapPoints={['10%', '40%']}
        handleComponent={null}
        enableHandlePanningGesture={false} // Prevent drag resize
        enableContentPanningGesture={false} // Prevent drag from content
        enableDynamicSizing={false}
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop
            {...backdropProps}
            appearsOnIndex={1}
            disappearsOnIndex={0}
            onPress={handleCollapse}
          />
        )}
      >
        {isExpanded && (
          <BottomSheetView style={styles.content}>
            <YStack style={styles.yStack}>
              {/* Header */}
              <View marginHorizontal="auto">
                <SizableText fontSize={25} fontWeight="700">Details</SizableText>
              </View>

              {/* Subtotal */}
              <XStack justifyContent="space-between" alignItems="center">
                <SizableText size="$7" fontWeight="500">Subtotal</SizableText>
                <SizableText size="$8" fontWeight="600">$24</SizableText>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <SizableText size="$7" fontWeight="500">Tax</SizableText>
                <SizableText size="$8" fontWeight="600">5%</SizableText>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center">
                <SizableText size="$7" fontWeight="500">Total</SizableText>
                <SizableText size="$8" fontWeight="600" color={Colors.primary}>$125.99</SizableText>
              </XStack>
            </YStack>
          </BottomSheetView>
        )}
      </BottomSheet>

      {/* Checkout container */}
      <XStack
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        padding={12}
      >
        <YStack marginLeft={8} marginBottom={-8}>
          <XStack marginRight={12}>
            <SizableText fontSize={18}>Total:&nbsp;</SizableText>
            <SizableText
              color={Colors.primary}
              fontSize={25}
              fontWeight="600"
            >
              $125.99
            </SizableText>
          </XStack>
          <Button
            unstyled
            pressStyle={{ opacity: 0.5 }}
            onPress={isExpanded ? handleCollapse : handleExpand}
          >
            <XStack alignItems="center">
              <SizableText color={Colors.primary} size="$5" marginRight={4}>Details</SizableText>
              <AntDesign name={isExpanded ? 'down' : 'up'} color={Colors.primary} size={14} />
            </XStack>
          </Button>
        </YStack>

        <Button
          width="45%"
          size="$5"
          borderRadius="$6"
          backgroundColor={Colors.primary}
          pressStyle={{ backgroundColor: Colors.primary }}
          color="white"
        >
          <SizableText size="$6" fontWeight="500">Checkout</SizableText>
        </Button>
      </XStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
    // height: '16%',
    // borderBottomWidth: 0,
  },
  background: {
    backgroundColor: Colors.darkGrey,
  },
  content: {
    // paddingHorizontal: 12,
    // height: '100%',
  },
  yStack: {
    gap: 8,
  },
});

export default Cart;
