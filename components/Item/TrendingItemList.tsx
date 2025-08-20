import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import { AxiosError } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IProductCard } from '@/interfaces/items';
import { ScrollView, Spinner, View } from 'tamagui';
import ItemCard from '@/components/Item/ItemCard';
import React from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

const TrendingItemList = () => {
  const { data, refetch, isFetching, isLoading } = useCustomizeQuery({
    queryKey: ['product', 'trending', 'fetch'],
    queryFn: QueryConfigs.fetchTrendingProducts,
    onError: (err: AxiosError<IBaseApiResponse>) => {
      console.error('Cannot fetch user:', err);
    },
  });

  const trendingItemListData = data?.data.data as IProductCard[];

  if (isLoading) {
    return (
      <View marginTop={SCREEN_HEIGHT / 5}>
        <Spinner size="large" color="white" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={refetch}
          tintColor="white"
        />
      }
    >
      {trendingItemListData.map((item: IProductCard) => (
        <ItemCard
          key={item._id}
          title={item.title}
          images={[require('@/assets/images/macaron.jpg')]}
          price={item.price}
          marginBottom={8}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default TrendingItemList;
