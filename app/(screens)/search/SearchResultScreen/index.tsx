import { ScrollView, SizableText, Spinner, View } from 'tamagui';
import React, { useEffect, useState } from 'react';
import ItemCard from '@/components/Item/ItemCard';
import { useSearch } from '@/context/search-context';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import QueryConfigs from '@/configs/api/query-config';
import useCustomizeQuery from '@/hooks/use-customize-query';
import { IKujiCard, IProductCard } from '@/interfaces/items';

const SearchResultScreen = () => {
  const { searchQuery, isKuji } = useSearch();
  const [searchResult, setSearchResult] = useState<IProductCard[] | IKujiCard[] | []>([]);

  const { isLoading, data, isSuccess } = useCustomizeQuery({
    queryKey: ['fuzzy', 'search', 'fetch'],
    queryFn: () => QueryConfigs.fetchFuzzySearch(searchQuery, isKuji),
    enabled: !!searchQuery.trim(),
    gcTime: 0,
  });

  useEffect(() => {
    setSearchResult(data?.data.data ?? []);
  }, [data]);

  return (
    <>
      {isLoading &&
        <View marginTop={SCREEN_HEIGHT / 4}>
          <Spinner size="small" color="white" />
        </View>}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        marginTop={8}
        height="100%"
        keyboardShouldPersistTaps="handled"
      >
        {searchResult.length > 0
          && searchResult.map(item => (
            <ItemCard
              key={item._id}
              id={item._id}
              title={item.title}
              images={item.images}
              price={item.price}
              marginBottom={8}
            />
          ))}
        {(isSuccess && !data?.data.data)
          && (
            <View marginHorizontal="auto" marginTop={30}>
              <SizableText size="$8">No results</SizableText>
            </View>
          )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default SearchResultScreen;
