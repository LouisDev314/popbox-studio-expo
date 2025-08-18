import { Spinner, YStack } from 'tamagui';
import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import ItemCard from '@/components/Item/ItemCard';
import { IItemsResponse, IKujiCard, IProductCard } from '@/interfaces/items';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';

interface IProductListProps {
  isKuji: boolean;
  queryResult: UseInfiniteQueryResult<InfiniteData<AxiosResponse<IBaseApiResponse<IItemsResponse>, unknown>, unknown>, Error>;
}

const ItemList = (props: IProductListProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = props.queryResult;

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
      <ItemCard
        title={item.title}
        images={[require('@/assets/images/macaron.jpg')]}
        price={item.price}
        marginBottom={8}
      />
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
      columnWrapperStyle={{ gap: 8 }}
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

export default ItemList;
