import { Spinner, View, YStack } from 'tamagui';
import React, { ReactElement, useMemo } from 'react';
import { Animated, RefreshControl, StyleSheet } from 'react-native';
import ItemCard from '@/components/Item/ItemCard';
import { IItemsResponse } from '@/interfaces/items';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
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
    <Animated.FlatList
      style={styles.container}
      contentContainerStyle={{ paddingTop: MAX_HEADER_HEIGHT }}
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
          progressViewOffset={MAX_HEADER_HEIGHT}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: -70,
    marginTop: 50,
  },
});

export default ItemList;
