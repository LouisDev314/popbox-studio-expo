import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';

// TODO
const Cart = () => {
  // Sample cart data - replace with your actual cart state
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop',
    },
    {
      id: '2',
      name: 'Organic Cotton T-Shirt',
      price: 29.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop',
    },
    {
      id: '3',
      name: 'Leather Wallet',
      price: 89.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=150&h=150&fit=crop',
    },
  ]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% GST
  // const shipping = subtotal > 199 ? 0 : 15.99; // Free shipping over $199
  const shipping = 0;
  const total = subtotal + tax + shipping;

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item,
    ));
  };

  const removeItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => updateQuantity(id, 0) },
      ],
    );
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

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={AppStyleSheet.bg}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some items to get started</Text>
          <Button style={styles.continueShoppingBtn}>
            Continue Shopping
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={AppStyleSheet.bg}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.itemCount}>{cartItems.length} items</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

                {/* Quantity Controls */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.quantityBtnText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.quantityBtn}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.quantityBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remove Button */}
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeItem(item.id)}
              >
                <Text style={styles.removeBtnText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            {/*<Text style={styles.summaryValue}>*/}
            {/*  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}*/}
            {/*</Text>*/}
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>

        <Button
          style={styles.checkoutBtn}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutBtnText}>
            Proceed to Checkout • ${total.toFixed(2)}
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  itemCount: {
    fontSize: 16,
    color: '#666',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  continueShoppingBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  // Cart Items
  itemsContainer: {
    paddingTop: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemOptions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  removeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Promo Section
  promoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  applyBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  applyBtnText: {
    color: 'white',
    fontWeight: '600',
  },
  promoSuccess: {
    color: '#34C759',
    fontSize: 14,
    marginTop: 8,
  },

  // Summary
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },

  // Checkout
  checkoutContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  checkoutBtn: {
    backgroundColor: '#007AFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Cart;
