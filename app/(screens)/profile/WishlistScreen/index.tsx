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

const WishlistScreen = () => {
  const { fetchWishlist, isFetchingWishlist } = useWishlist();
  const user = useGetUser();

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
      {!user?.wishlist?.length ?
        <View height="100%" alignItems="center" justifyContent="center">
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isFetchingWishlist}
                onRefresh={handleRefresh}
                tintColor="white"
                // progressViewOffset={120}
              />
            }
          >
            {/*<CustomizeImage*/}
            {/*  uri={}*/}
            {/*  style={{*/}
            {/*    width: '100%',*/}
            {/*    height: '100%',*/}
            {/*    borderRadius: 15,*/}
            {/*  }}*/}
            {/*/>*/}
            <SizableText>Nothing in the wishlist yet</SizableText>
          </ScrollView>
        </View> :
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetchingWishlist}
              onRefresh={handleRefresh}
              tintColor="white"
              // progressViewOffset={120}
            />
          }
        >
          {user?.wishlist?.map((item) => (
            <WishlistItem key={item.itemId} item={item} />
          ))}
        </ScrollView>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
});

export default WishlistScreen;
