import { router, useLocalSearchParams } from 'expo-router';
import { Button, Image, ScrollView, SizableText, Spinner, Text, View, XStack } from 'tamagui';
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

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<IProduct | null>(null);

  const { data, isLoading } = useCustomizeQuery({
    queryKey: [id, 'product', 'fetch'],
    queryFn: () => QueryConfigs.fetchProductById(id as string),
    onError: (err) => {
      console.error('Cannot fetch user:', err);
    },
    enabled: !!id,
  });

  useEffect(() => {
    setProduct(data?.data.data ?? null);
  }, [data]);

  const handleReturn = () => {
    router.back();
  };

  const handleAddToWishlist = () => {
    // TODO: wishlist
    console.log('addToWishlist');
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
      <ScrollView height="100%" gridRowGap="5">
        <ImageCarousel imgUrls={product.images} />
        <View paddingHorizontal={10}>
          <SizableText marginTop={15} size="$8">{product.title}</SizableText>
          <XStack alignItems="center" justifyContent="space-between">
            <SizableText size="$8" marginTop={10}>
              ${product.price}
            </SizableText>
            <Button circular onPress={handleAddToWishlist} size="$5">
              <Ionicons name="heart-outline" color={Colors.primary} size={32} />
            </Button>
          </XStack>
          <Text>{product.size}</Text>
        </View>
      </ScrollView>
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
