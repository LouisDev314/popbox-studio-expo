import { Button, SizableText, View } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ItemList from '@/components/Item/ItemList';
import FiltersBottomSheet from '@/components/BottomSheet/Filters';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import useItemsInfinite, { IItemParam } from '@/hooks/use-items-infinite';
import { useAuth } from '@/context/auth-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { ProductCategory, ProductsOrder, ProductSortBy } from '@/enums/sort-by-filters';
import { MAX_HEADER_HEIGHT } from '@/constants/app';

interface ISearchInitScreenProps {
  isKuji: boolean;
  scrollY: Animated.Value;
}

const SearchInitScreen = (props: ISearchInitScreenProps) => {
  const { isAuthenticated } = useAuth();
  const [queryKeyItemParam, setQueryKeyItemParam] = useState<IItemParam>({
    category: ProductCategory.All,
    sortBy: ProductSortBy.SalesVolume,
    order: ProductsOrder.Desc,
  });
  const queryResult = useItemsInfinite(queryKeyItemParam, props.isKuji, isAuthenticated);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

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
            inputRange: [0, MAX_HEADER_HEIGHT],
            outputRange: [MAX_HEADER_HEIGHT, 50], // Start below header, move to top snap point
            extrapolate: 'clamp',
          }),
        }],
      }}>
        <SizableText fontSize={35} paddingTop={20} fontWeight="bold">Products</SizableText>
        <View style={styles.filterContainer}>
          <Button
            icon={<Ionicons name="filter-outline" color="white" size={20} />}
            onPress={handleOpenBottomSheet}
          >
            <SizableText size="$5">
              Filters
            </SizableText>
          </Button>
        </View>
      </Animated.View>
      <ItemList
        isKuji={props.isKuji}
        queryResult={queryResult}
        listTitle={<></>}
        handleScroll={handleScroll}
      />
      <FiltersBottomSheet ref={bottomSheetRef} isKuji={props.isKuji}
                          handleCloseBottomSheet={handleCloseBottomSheet} setQueryKeyItemParam={setQueryKeyItemParam} />
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
});

export default SearchInitScreen;
