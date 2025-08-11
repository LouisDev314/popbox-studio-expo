import React, { forwardRef } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Portal } from '@gorhom/portal';
import { StyleSheet, View } from 'react-native';
import CustomizeBottomSheetView from '@/components/BottomSheet/Filters/CustomizeBottomSheetView';
import { Button } from 'tamagui';
import { filterOptions } from '@/constants/item-filters';
import Colors from '@/constants/colors';

interface IFiltersBottomSheetProps {
  snapPoints: string[];
  handleCloseBottomSheet: () => void;
  isKuji?: boolean;
}

const FiltersBottomSheet = forwardRef<BottomSheetMethods, IFiltersBottomSheetProps>(
  (props, ref) => {
    const handleApply = () => {
      // Handle apply logic here
      console.log('Apply');
    };

    const handleCancel = () => {
      props.handleCloseBottomSheet();
    };

    const filters = filterOptions(props.isKuji);

    return (
      <Portal>
        <BottomSheet
          ref={ref}
          index={-1} // starts closed
          snapPoints={props.snapPoints}
          enablePanDownToClose={true}
          handleIndicatorStyle={styles.handleBar}
          // backgroundComponent={(backgroundProps) => (
          //   <View
          //     {...backgroundProps}
          //     style={{ borderRadius: 24 }}
          //   />
          // )}
          backdropComponent={(backdropProps) => (
            <BottomSheetBackdrop
              {...backdropProps}
              appearsOnIndex={0}        // index at which backdrop appears
              disappearsOnIndex={-1}    // index at which backdrop disappears
              pressBehavior="close"     // press behavior to close the sheet
            />
          )}
          footerComponent={(props) => (
            <BottomSheetFooter {...props} bottomInset={24}>
              <View style={styles.footerContainer}>
                <Button
                  borderRadius={16}
                  backgroundColor={Colors.primary}
                  onPress={handleApply}
                  fontWeight="bold"
                  fontSize={18}
                  height={55}
                >
                  Apply
                </Button>
                <Button
                  borderRadius={16}
                  onPress={handleCancel}
                  fontSize={18}
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
          style={styles.container}
        >
          <CustomizeBottomSheetView isKuji={props.isKuji} filters={filters} />
        </BottomSheet>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 12,
  },
  handleBar: {
    backgroundColor: '#E0E0E0',
    width: 40,
  },
  footerContainer: {
    padding: 12,
    rowGap: 12,
    marginBottom: 16,
  },
  background: {
    borderRadius: 16,
  },
});

export default FiltersBottomSheet;
