import React, { forwardRef, useState } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Portal } from '@gorhom/portal';
import { StyleSheet } from 'react-native';
import CustomizeBottomSheetView from '@/components/BottomSheet/Filters/CustomizeBottomSheetView';
import { Button, View } from 'tamagui';
import { filterOptions } from '@/constants/item-filters';
import Colors from '@/constants/colors';
import { InfiniteData, QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IKujisResponse } from '@/interfaces/kujis';

interface IFiltersBottomSheetProps {
  snapPoints: string[];
  handleCloseBottomSheet: () => void;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<InfiniteData<AxiosResponse<IBaseApiResponse<IKujisResponse>, any>, unknown>, Error>>;
  isKuji?: boolean;
}

const FiltersBottomSheet = forwardRef<BottomSheetMethods, IFiltersBottomSheetProps>(
  (props, ref) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSortBy, setSelectedSortBy] = useState('Date');
    const [selectedOrder, setSelectedOrder] = useState('Descending');

    const handleApply = async () => {
      props.handleCloseBottomSheet();
      await props.refetch();
    };

    const handleCancel = () => {
      setSelectedCategory('All');
      setSelectedSortBy('Date');
      setSelectedOrder('Descending');
      props.handleCloseBottomSheet();
    };

    const filters = filterOptions(props.isKuji);

    return (
      <Portal>
        <BottomSheet
          style={styles.container}
          ref={ref}
          index={-1} // starts closed
          snapPoints={props.snapPoints}
          enablePanDownToClose={true}
          enableDynamicSizing={false}
          handleIndicatorStyle={styles.handleBar}
          backdropComponent={(backdropProps) => (
            <BottomSheetBackdrop
              {...backdropProps}
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              pressBehavior="close"
            />
          )}
          footerComponent={(props) => (
            <BottomSheetFooter {...props}>
              <View paddingBottom={48} style={styles.footerContainer}>
                <Button
                  borderRadius={16}
                  backgroundColor={Colors.primary}
                  onPress={handleApply}
                  fontWeight="bold"
                  fontSize="$7"
                  height={55}
                >
                  Apply
                </Button>
                <Button
                  borderRadius={16}
                  onPress={handleCancel}
                  fontSize="$6"
                  borderColor={Colors.primary}
                  borderWidth={2}
                  backgroundColor="white"
                  height={55}
                >
                  Cancel
                </Button>
              </View>
            </BottomSheetFooter>
          )}
        >
          <CustomizeBottomSheetView
            isKuji={props.isKuji}
            filters={filters}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSortBy={selectedSortBy}
            setSelectedSortBy={setSelectedSortBy}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
        </BottomSheet>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: -2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    padding: 12,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
  },
  handleBar: {
    backgroundColor: '#E0E0E0',
    width: 40,
  },
  footerContainer: {
    padding: 12,
    rowGap: 12,
    backgroundColor: 'white',
  },
  background: {
    borderRadius: 16,
  },
});

export default FiltersBottomSheet;
