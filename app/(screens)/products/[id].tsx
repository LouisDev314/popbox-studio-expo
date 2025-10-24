import { router, useLocalSearchParams } from 'expo-router';
import { Button, Image, ScrollView, SizableText, Spinner, View, XStack } from 'tamagui';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import AppStyleSheet from '@/constants/app-stylesheet';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCarousel from '@/components/ImageCarousel';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { RefreshControl, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { useGetUser, useSetUser } from '@/hooks/use-user-store';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import MutationConfigs from '@/configs/api/mutation-config';
import { useWishlist } from '@/context/wishlist-context';
import useDebounce from '@/hooks/use-debounce';
import { ItemType } from '@/enums/items';
import { IItem } from '@/interfaces/items';
import QuantitySelector from '@/components/QuantitySelector';
import { IWishlistItem } from '@/interfaces/wishlist';

// eslint-disable-next-line complexity
const ProductDetailScreen = () => {
  const { id, itemType } = useLocalSearchParams();
  const isItemTypeKuji = itemType === ItemType.Kuji;
  const [item, setItem] = useState<IItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [overBoughtMsg, setOverBoughtMsg] = useState('');
  const [isItemInWishlist, setIsItemInWishlist] = useState(false);
  const { handleRemoveWishlistItem } = useWishlist();
  const user = useGetUser();
  const setUser = useSetUser();

  // TODO: setOverBoughtMsg to toast instead

  useEffect(() => {
    setIsItemInWishlist(!!user?.wishlist?.some((item: IWishlistItem) => item.itemId === id));
  }, []);

  const useDebouncedToggleAddToWishlist = useDebounce(() => {
    if (isItemInWishlist) {
      handleRemoveWishlistItem(currWishlistItem);
    } else {
      addItemToWishlist({
        uid: user!.uid,
        item: { itemId: id as string, itemType: item!.itemType },
      });
    }
  }, 300);

  const handleToggleAddToWishlist = () => {
    setIsItemInWishlist(prev => !prev);
    useDebouncedToggleAddToWishlist();
  };

  const queryFn = isItemTypeKuji ? () => QueryConfigs.fetchKujiById(id as string) : () => QueryConfigs.fetchProductById(id as string);
  const { refetch, data, isLoading: isFetchingItem } = useCustomizeQuery({
    queryKey: [id, isItemTypeKuji ? 'kuji' : 'product', 'fetch'],
    queryFn,
    onError: (err) => {
      console.error('Cannot fetch item by id:', err.response?.data);
    },
    enabled: !!id,
  });

  useEffect(() => {
    setItem(data?.data.data as IItem);
    if (item && item.inventory <= 0) {
      setOverBoughtMsg('This item is currently out of stock.');
    }
  }, [data]);

  const { mutation: addItemToWishlist } = useCustomizeMutation({
    mutationFn: MutationConfigs.addItemToWishlist,
    onSuccess: () => {
      const updatedWishlist = [
        ...(user?.wishlist ?? []),
        currWishlistItem,
      ];
      const updatedUser = { ...user!, wishlist: updatedWishlist };
      setUser(updatedUser);
    },
    onError: (err) => {
      console.error('Cannot add item to wishlist', err);
    },
  });

  const { mutation: addItemToCart, isPending: isAddingItemToCart } = useCustomizeMutation({
    mutationFn: MutationConfigs.addItemToCart,
    onSuccess: (data) => {
      const updatedCurrCartItem = { ...currCartItem, quantity: currCartItem.quantity + quantity };
      const updatedCart = [
        ...(user?.cart ?? []),
        updatedCurrCartItem,
      ];
      const updatedUser = { ...user!, cart: updatedCart };
      setUser(updatedUser);
    },
    onError: (err) => {
      // TODO: use Toast to indicate cannot add item
      console.error('Cannot add item to cart', err);
    },
  });

  const handleReturn = () => {
    router.back();
  };

  // Don't render carousel until we have product data with images
  if (!user || isFetchingItem || !item || !item.images || item.images.length === 0) {
    return (
      <View style={AppStyleSheet.bg} alignItems="center">
        <XStack width="100%" alignItems="center" marginTop={60} justifyContent="space-between">
          <Button
            size="$1"
            backgroundColor="transparent"
            marginBottom={12}
            height="100%"
            onPress={handleReturn}
            icon={<Ionicons name="chevron-back-outline" color="white" size={32} />}
          />
        </XStack>
        <View marginTop={SCREEN_HEIGHT / 3}>
          <Spinner size="small" color="white" />
        </View>
      </View>
    );
  }

  const currWishlistItem = {
    itemId: item._id,
    title: item.title,
    images: item.images,
    price: item.price,
    itemType: item.itemType,
  };

  const currCartItem = {
    itemId: item._id,
    title: item.title,
    images: item.images,
    price: item.price,
    itemType: item.itemType,
    quantity,
  };

  const handleAddToCart = () => {
    const currCartItem = user.cart.find(item => item.itemId === id);

    let quantityToAdd = quantity;
    // If item already in cart
    if (currCartItem) {
      // If user already has max inventory in cart, notify and exit
      if (currCartItem.quantity >= item.inventory) {
        setOverBoughtMsg(`You’ve added the last ${item.inventory} available items to your cart.`);
        return;
      }

      // Calculate prospective quantity after adding more
      const prospectiveQuantity = quantity + currCartItem.quantity;

      // If prospective quantity exceeds inventory but user currently has less than max
      if (prospectiveQuantity > item.inventory && currCartItem.quantity < item.inventory) {
        // Limit quantityToAdd to available stock remainder
        quantityToAdd = item.inventory - currCartItem.quantity;
        setOverBoughtMsg(`Only ${quantityToAdd} ${quantityToAdd === 1 ? 'item' : 'items'} added due to limited availability.`);
      } else {
        // Valid quantity
        setOverBoughtMsg('');
      }
    }

    addItemToCart({
      uid: user.uid,
      item: {
        itemId: id as string,
        itemType: item.itemType,
        quantity: quantityToAdd,
        price: item.price,
      },
    });
  };

  return (
    <View style={AppStyleSheet.bg} alignItems="center" justifyContent="center">
      <XStack width="100%" alignItems="center" marginTop={60}>
        <Button
          size="$1"
          backgroundColor="transparent"
          marginBottom={12}
          height="100%"
          onPress={handleReturn}
          icon={<Ionicons name="chevron-back-outline" color="white" size={32} />}
        />
        <Image style={styles.logoContainer} source={{
          uri: require('@/assets/images/logo.png'),
        }} />
      </XStack>
      <ScrollView
        height="100%"
        marginTop={10}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingItem}
            onRefresh={refetch}
            tintColor="white"
          />
        }
      >
        {/* TODO: Optimization - use skeleton */}
        <ImageCarousel imgUrls={item.images} />
        <View paddingHorizontal={10}>
          <SizableText size="$8">{item.title}</SizableText>
          <XStack alignItems="center" justifyContent="space-between">
            <SizableText size="$9" marginTop={10} color={Colors.primary} fontWeight="500">
              ${item.price}
            </SizableText>
            <Button circular onPress={handleToggleAddToWishlist} size="$5" marginTop={10}>
              {isItemInWishlist ? <Ionicons name="heart" color={Colors.primary} size={32} /> :
                <Ionicons name="heart-outline" color={Colors.primary} size={32} />}
            </Button>
          </XStack>
          <SizableText size="$7" marginTop={15}>Size</SizableText>
          <SizableText size="$5">{item.size}</SizableText>
          <SizableText size="$7" marginTop={20}>Material</SizableText>
          <SizableText size="$5">{item.material}</SizableText>
        </View>
      </ScrollView>
      <SizableText size="$6" color={Colors.primary} marginBottom={5}>
        {overBoughtMsg}
      </SizableText>
      <XStack
        bottom={0}
        width="100%"
        height={90}
        justifyContent="space-between"
        paddingHorizontal={10}
      >
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          style={{
            height: 56,
            borderRadius: 20,
            width: '36%',
            gap: 8,
          }} />
        <Button
          borderRadius={16}
          width="60%"
          height={55}
          backgroundColor={Colors.primary}
          pressStyle={{ backgroundColor: Colors.primary }}
          onPress={handleAddToCart}
          disabledStyle={{ backgroundColor: item.inventory <= 0 ? Colors.grey : Colors.primary }}
          disabled={isAddingItemToCart || item.inventory <= 0}
        >
          {isAddingItemToCart ? <Spinner size="small" color="white" /> :
            <SizableText size="$7" color="white"
                         fontWeight="500">{item.inventory <= 0 ? 'Sold Out' : 'Add to Cart'}</SizableText>
          }
        </Button>
      </XStack>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 150,
    height: 50,
    marginTop: -15,
    marginLeft: 75,
  },
});

export default ProductDetailScreen;
