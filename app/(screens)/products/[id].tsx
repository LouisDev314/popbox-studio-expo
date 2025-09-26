import { router, useLocalSearchParams } from 'expo-router';
import { Button, Image, ScrollView, SizableText, Spinner, View, XStack } from 'tamagui';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import AppStyleSheet from '@/constants/app-stylesheet';
import React, { useEffect, useState } from 'react';
import IProduct from '@/interfaces/product';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCarousel from '@/components/ImageCarousel';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { useSetUser, useUser } from '@/hooks/use-user-store';
import { IWishlistItem } from '@/interfaces/wishlist';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import MutationConfigs from '@/configs/api/mutation-config';
import { useWishlist } from '@/context/wishlist-context';

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [overBoughtMsg, setOverBoughtMsg] = useState('');
  const [isProductInWishlist, setIsProductInWishlist] = useState(false);
  const { handleRemoveWishlistItem } = useWishlist();
  const user = useUser();
  const setUser = useSetUser();

  const { data, isLoading } = useCustomizeQuery({
    queryKey: [id, 'product', 'fetch'],
    queryFn: () => QueryConfigs.fetchProductById(id as string),
    onError: (err) => {
      console.error('Cannot fetch product by id:', err.response?.data);
    },
    enabled: !!id,
  });

  useEffect(() => {
    setProduct(data?.data.data ?? null);
  }, [data]);

  useEffect(() => {
    setIsProductInWishlist(!!user?.wishlist?.some((item: IWishlistItem) => item.itemId === id));
  }, []);

  const { mutation: addToWishlist } = useCustomizeMutation({
    mutationFn: MutationConfigs.addItemToWishlist,
    onSuccess: () => {
      const updatedWishlist = [
        ...(user?.wishlist ?? []),
        currItem,
      ];
      const updatedUser = { ...user!, wishlist: updatedWishlist };
      setUser(updatedUser);
    },
    onError: (err) => {
      console.error('Cannot add item', err);
    },
  });

  const handleReturn = () => {
    router.back();
  };

  // Don't render carousel until we have product data with images
  if (isLoading || !product || !product.images || product.images.length === 0) {
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

  const currItem = {
    itemId: product!._id,
    title: product!.title,
    images: product!.images,
    price: product!.price,
    itemType: product!.itemType,
  };

  const toggleAddToWishlist = () => {
    setIsProductInWishlist(prevState => !prevState);
    if (isProductInWishlist) {
      handleRemoveWishlistItem(currItem);
    } else {
      addToWishlist({
        uid: user!.uid,
        item: { itemId: (id as string), itemType: product!.itemType },
      });
    }
  };

  const handleAddToCart = () => {
    console.log('addToCart');
    // Over purchase
    if (product && quantity > product.inventory) {
      setOverBoughtMsg(`Only added ${product.inventory} to your cart due to availability.`);
    } else {

    }
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
      <ScrollView height="100%" marginTop={10}>
        <ImageCarousel imgUrls={product.images} />
        <View paddingHorizontal={10}>
          <SizableText size="$8">{product.title}</SizableText>
          <XStack alignItems="center" justifyContent="space-between">
            <SizableText size="$9" marginTop={10} color={Colors.primary} fontWeight="500">
              ${product.price}
            </SizableText>
            <Button circular onPress={toggleAddToWishlist} size="$5" marginTop={10}>
              {isProductInWishlist ? <Ionicons name="heart" color={Colors.primary} size={32} /> :
                <Ionicons name="heart-outline" color={Colors.primary} size={32} />}
            </Button>
          </XStack>
          <SizableText size="$7" marginTop={15}>Size</SizableText>
          <SizableText size="$5">{product.size}</SizableText>
          <SizableText size="$7" marginTop={20}>Material</SizableText>
          <SizableText size="$5">{product.material}</SizableText>
        </View>
      </ScrollView>
      <SizableText size="$6" color="red" marginBottom={5}>
        {overBoughtMsg}
      </SizableText>
      <XStack
        bottom={0}
        width="100%"
        height={90}
        justifyContent="space-between"
        paddingHorizontal={10}
      >
        <XStack
          width="36%"
          justifyContent="space-between"
          alignItems="center"
          height={56}
          borderRadius={20}
          style={styles.counter}
        >
          <Button
            onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
          >
            <SizableText size="$8">-</SizableText>
          </Button>
          <SizableText size="$7">{quantity}</SizableText>
          <Button
            onPress={() => setQuantity(prev => prev + 1)}
          >
            <SizableText size="$8">+</SizableText>
          </Button>
        </XStack>
        <Button
          borderRadius={16}
          width="60%"
          height={55}
          backgroundColor={Colors.primary}
          pressStyle={{ backgroundColor: Colors.primary }}
          onPress={handleAddToCart}
        >
          <SizableText size="$7" color="floralwhite">Add to cart</SizableText>
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
  counter: {
    gap: 8,
  },
});

export default ProductDetailScreen;
