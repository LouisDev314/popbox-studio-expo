import { Button, SizableText, View } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ItemList from '@/components/Item/ItemList';
import FiltersBottomSheet from '@/components/BottomSheet/Filters';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import useItemsInfinite, { IItemParam } from '@/hooks/use-items-infinite';
import { useAuth } from '@/context/auth-context';
import BottomSheet from '@gorhom/bottom-sheet';

interface ISearchInitScreenProps {
  isKuji: boolean;
}

const SearchInitScreen = (props: ISearchInitScreenProps) => {
  const { isAuthenticated } = useAuth();
  const [queryKeyItemParam, setQueryKeyItemParam] = useState<IItemParam>({
    category: 'all',
    sortBy: 'date',
    order: 'desc',
  });
  const queryResult = useItemsInfinite(queryKeyItemParam, props.isKuji, false, isAuthenticated);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <View>
      <SizableText size="$9" marginVertical="12">New Drops</SizableText>
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
      <ItemList isKuji={props.isKuji} queryResult={queryResult} />
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
