import { Image, Spinner, YStack } from 'tamagui';
import React, { useCallback, useMemo } from 'react';
import AppStyleSheet from '@/constants/app-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import ProductCard from '@/components/Product/ProductCard';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import useProductsInfinite from '@/hooks/use-products-infinite';
import { IProductCardResponse } from '@/interfaces/products';

const Home = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useProductsInfinite({}, isAuthenticated);

  const flattenedData = useMemo(() => {
    return data?.pages.flatMap(page => page.data.data.items) ?? [];
  }, [data]);

  const getItemLayout = useCallback((data: (ArrayLike<IProductCardResponse> | null | undefined), index: number) => ({
    length: 320,
    offset: 320 * index,
    index,
  }), []);

  if (isLoading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="large" />
    </View>;
  }

  if (!isAuthLoading && !isAuthenticated) {
    return <Redirect href="/(screens)/auth/login" />;
  }

  const renderItem = ({ item }: { item: IProductCardResponse }) => {
    return (
      <ProductCard title={item.title}
                   images={[require('@/assets/images/macaron.jpg')]}
                   price={item.price} />
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  };

  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) await fetchNextPage();
  };

  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Image style={styles.logoContainer} source={{
        uri: require('@/assets/images/logo.png'),
      }} />
      <FlatList
        data={flattenedData}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        numColumns={2}
        getItemLayout={getItemLayout}
        columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingNextPage}
            onRefresh={refetch}
            tintColor="white"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 200,
    height: 100,
    marginHorizontal: 'auto',
  },
});

export default Home;
