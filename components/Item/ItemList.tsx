import { Spinner, View, YStack } from 'tamagui';
import React, { ReactElement, useMemo } from 'react';
import { Animated, RefreshControl } from 'react-native';
import ItemCard from '@/components/Item/ItemCard';
import { IItemsResponse } from '@/interfaces/items';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MAX_HEADER_HEIGHT } from '@/constants/app';

interface IProductListProps {
  isKuji: boolean;
  queryResult: UseInfiniteQueryResult<InfiniteData<AxiosResponse<IBaseApiResponse<IItemsResponse>, unknown>, unknown>, Error>;
  listTitle: ReactElement;
  handleScroll: () => void;
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

  if (isLoading) {
    return (
      <View marginTop={SCREEN_HEIGHT / 3}>
        <Spinner size="small" color="white" />
      </View>
    );
  }

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <YStack padding="$4" alignItems="center">
        <Spinner size="small" color="white" />
      </YStack>
    );
  };

  const handleLoadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) await fetchNextPage();
  };

  return (
    <SafeAreaView>
      <Animated.FlatList
        contentContainerStyle={{ paddingTop: MAX_HEADER_HEIGHT - 10 }}
        scrollEventThrottle={16}
        data={flattenedData}
        onScroll={props.handleScroll}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ItemCard
            id={item._id}
            title={item.title}
            images={item.images}
            price={item.price}
            marginBottom={8}
          />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        numColumns={2}
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
    </SafeAreaView>
  );
};

export default ItemList;
