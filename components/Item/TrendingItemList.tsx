import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import { AxiosError } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IProductCard } from '@/interfaces/items';
import { SizableText, Spinner, View } from 'tamagui';
import ItemCard from '@/components/Item/ItemCard';
import React from 'react';
import { Animated, RefreshControl, StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

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
      <View marginTop={SCREEN_HEIGHT / 4}>
        <Spinner size="small" color="white" />
      </View>
    );
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: props.scrollY } } }],
    { useNativeDriver: true },
  );

  return (
    <View marginBottom={182}>
      {/* Sticky Trending Header */}
      <SizableText marginVertical={12} size="$9" fontWeight="bold">Trending</SizableText>

      {/* Scrollable Product List */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="white"
          />
        }
      >
        {trendingItemListData?.map((item: IProductCard) => (
          <ItemCard
            key={item._id}
            title={item.title}
            images={[require('@/assets/images/macaron.jpg')]}
            price={item.price}
            marginBottom={8}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default TrendingItemList;
