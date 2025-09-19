import { SizableText, View } from 'tamagui';
import ItemList from '@/components/Item/ItemList';
import FiltersBottomSheet from '@/components/BottomSheet/Filters';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, FlatList } from 'react-native';
import useItemsInfinite from '@/hooks/use-items-infinite';
import { useAuth } from '@/context/auth-context';
import { ProductCategory, ProductsOrder, ProductSortBy } from '@/enums/sort-by-filters';
import { MAX_HEADER_HEIGHT } from '@/constants/app';
import { useSearch } from '@/context/search-context';
import { IItemSearchOptions } from '@/interfaces/search';

interface ISearchInitScreenProps {
  scrollY: Animated.Value;
}

const SearchInitScreen = (props: ISearchInitScreenProps) => {
  const { isAuthenticated } = useAuth();
  const { bottomSheetRef, isKuji } = useSearch();
  const [queryKeyItemParam, setQueryKeyItemParam] = useState<IItemSearchOptions>({
    category: ProductCategory.All,
    sortBy: ProductSortBy.SalesVolume,
    order: ProductsOrder.Desc,
  });
  const queryResult = useItemsInfinite(queryKeyItemParam, isKuji, isAuthenticated);

  const flatListRef = useRef<FlatList>(null);

  // TODO: Not necessary with current design
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    // Add delay to ensure value is set
    setTimeout(() => {
      props.scrollY.setValue(0);
    }, 0);
  };

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: props.scrollY } } }],
    { useNativeDriver: true },
  );

  return (
    <View marginBottom={120}>
      <Animated.View style={{
        transform: [{
          translateY: props.scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [MAX_HEADER_HEIGHT, 50], // Start below header, move to top snap point
            extrapolate: 'clamp',
          }),
        }],
      }}>
        <SizableText fontSize={38} paddingTop={20} fontWeight="bold">Products</SizableText>
      </Animated.View>
      <ItemList
        ref={flatListRef}
        queryResult={queryResult}
        // listTitle={<></>}
        handleScroll={handleScroll}
      />
      <FiltersBottomSheet ref={bottomSheetRef} scrollToTop={scrollToTop} isKuji={isKuji}
                          handleCloseBottomSheet={handleCloseBottomSheet} setQueryKeyItemParam={setQueryKeyItemParam} />
    </View>
  );
};

export default SearchInitScreen;
