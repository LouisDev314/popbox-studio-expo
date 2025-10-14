import AppStyleSheet from '@/constants/app-stylesheet';
import { Button, ScrollView, SizableText, View, XStack } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetUser } from '@/hooks/use-user-store';
import WishlistItem from '@/components/WishlistItem';
import ItemTypeSelector from '@/components/ItemTypeSelector';
import { RefreshControl, StyleSheet } from 'react-native';
import { useWishlist } from '@/context/wishlist-context';
import CustomizeImage from '@/components/CustomizeImage';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

const WishlistScreen = () => {
  const { fetchWishlist, isFetchingWishlist } = useWishlist();
  const user = useGetUser();
  const hasWishlistItem = !!user?.wishlist?.length;

  const handleReturn = () => {
    router.back();
  };

  const handleRefresh = () => {
    fetchWishlist();
  };

  return (
    <View style={AppStyleSheet.bg}>
      {/* Header */}
      <XStack width="100%" alignItems="center" justifyContent="space-between" marginTop={60}>
        <Button
          size="$1"
          backgroundColor="transparent"
          // marginBottom={12}
          height="100%"
          onPress={handleReturn}
          icon={<Ionicons name="chevron-back-outline" color="white" size={32} />}
        />
        <SizableText size="$8" fontWeight="bold">Wishlist</SizableText>
        <Button
          size="$1"
          backgroundColor="transparent"
          height="100%"
          onPress={() => {
            console.log('go to cart');
          }}
          icon={<MaterialCommunityIcons name="shopping-outline" size={30} />}
        />
      </XStack>
      <View style={[styles.segmentContainer]}>
        <ItemTypeSelector />
      </View>
      <ScrollView
        height="100%"
        refreshControl={
          <RefreshControl
            refreshing={isFetchingWishlist}
            onRefresh={handleRefresh}
            tintColor="white"
          />
        }
      >
        {!hasWishlistItem ? (
          <View marginTop={SCREEN_HEIGHT / 8} alignItems="center">
            <CustomizeImage
              source={require('@/assets/images/empty-wishlist.jpg')}
              style={{
                width: 250,
                height: 250,
                borderRadius: 900,
              }}
            />
            <SizableText size="$7" marginTop="$6" fontWeight="500">Nothing in your wishlist yet!</SizableText>
          </View>
        ) : (
          <>
            {user?.wishlist?.map((item) => (
              <WishlistItem key={item.itemId} item={item} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WishlistScreen;
