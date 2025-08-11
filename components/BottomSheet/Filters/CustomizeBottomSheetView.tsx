import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'tamagui';

export interface IFilterOption {
  label: string;
  value: string;
}

interface ICustomizeBottomSheetViewProps {
  filters: Record<string, IFilterOption[]>;
  isKuji?: boolean;
}

const CustomizeBottomSheetView = (props: ICustomizeBottomSheetViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSortBy, setSelectedSortBy] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');

  // const FilterSection = () => (
  //   <YStack gridRowGap="$3" marginBottom="$4">
  //     <Text fontSize="$5" fontWeight="600" color="$color">
  //       {title}
  //     </Text>
  //     <XStack flexWrap="wrap" gridColumnGap="$2">
  //       {options.map((option) => (
  //         <Button
  //           key={option.value}
  //           onPress={() => onSelect(option.value)}
  //           style={[
  //             styles.filterChip,
  //             selectedValue === option.value && styles.selectedChip,
  //           ]}
  //         >
  //           <Text
  //             color={selectedValue === option.value ? '$color' : '$gray10'}
  //             fontSize="$4"
  //           >
  //             {option.label}
  //           </Text>
  //         </Button>
  //       ))}
  //     </XStack>
  //   </YStack>
  // );

  return (
    <BottomSheetView style={styles.container}>
      <Text>
        Hello
      </Text>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  selectedChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
});

export default CustomizeBottomSheetView;
