import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import { AxiosError } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IProductCard } from '@/interfaces/items';
import { Spinner, View } from 'tamagui';
import ItemCard from '@/components/Item/ItemCard';
import React from 'react';
import { Animated, RefreshControl, StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { MAX_HEADER_HEIGHT } from '@/constants/app';

interface ITrendingItemListProps {
  scrollY: Animated.Value;
  isKuji: boolean;
}

const TrendingItemList = (props: ITrendingItemListProps) => {
  const { data, refetch, isFetching, isLoading } = useCustomizeQuery({
    queryKey: [props.isKuji ? 'kuji' : 'product', 'trending', 'fetch'],
    queryFn: props.isKuji ? QueryConfigs.fetchTrendingKujis : QueryConfigs.fetchTrendingProducts,
    onError: (err: AxiosError<IBaseApiResponse>) => {
      console.error('Cannot fetch products:', err);
    },
  });

  const trendingItemListData = data?.data.data as IProductCard[];

  if (isLoading) {
    return (
      <View marginTop={SCREEN_HEIGHT / 2}>
        <Spinner size="small" color="white" />
      </View>
    );
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: props.scrollY } } }],
    { useNativeDriver: true },
  );

  return (
    <Animated.FlatList
      style={styles.container}
      contentContainerStyle={{ paddingTop: 120 }}
      scrollEventThrottle={16}
      data={trendingItemListData}
      onScroll={handleScroll}
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
      numColumns={2}
      // getItemLayout={getItemLayout}
      columnWrapperStyle={{ gap: 8 }}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
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
    marginTop: 55,
  },
});

export default TrendingItemList;
