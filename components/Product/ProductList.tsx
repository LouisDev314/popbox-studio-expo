import { Spinner, YStack } from 'tamagui';
import { useAuth } from '@/context/auth-context';
import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import ProductCard from '@/components/Product/ProductCard';
import { IProductCard } from '@/interfaces/products';
import { IKujiCard } from '@/interfaces/kujis';
import useItemsInfinite from '@/hooks/use-items-infinite';

interface IProductListProps {
  isKuji: boolean;
}

const ProductList = (props: IProductListProps) => {
  const { isAuthenticated } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useItemsInfinite({}, props.isKuji, isAuthenticated);

  const flattenedData = useMemo(() => {
    return data?.pages.flatMap(page => page.data.data.items) ?? [];
  }, [data]);

  const getItemLayout = useCallback((data: (ArrayLike<IProductCard | IKujiCard> | null | undefined), index: number) => ({
    length: 320,
    offset: 320 * index,
    index,
  }), []);

  if (isLoading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Spinner size="large" />
    </View>;
  }

  const renderItem = ({ item }: { item: IProductCard | IKujiCard }) => {
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
  );
};

export default ProductList;
