import { BottomSheetSectionList, BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, SizableText, View } from 'tamagui';
import { IItemFilters } from '@/constants/item-filters';
import Colors from '@/constants/colors';

export interface IFilterOption {
  title: string;
  label: string;
  value: string;
}

interface ICustomizeBottomSheetViewProps {
  filters: IItemFilters[];
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedSortBy: string;
  setSelectedSortBy: React.Dispatch<React.SetStateAction<string>>;
  selectedOrder: string;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string>>;
  isKuji?: boolean;
}

const CustomizeBottomSheetView = (props: ICustomizeBottomSheetViewProps) => {
  const isSelected = (label: string) => {
    return props.selectedCategory === label || props.selectedSortBy === label || props.selectedOrder === label;
  };

  const handleButtonPress = (item: IFilterOption, sectionTitle: string) => {
    switch (sectionTitle) {
      case 'category':
        props.setSelectedCategory(item.label);
        break;
      case 'sortBy':
        props.setSelectedSortBy(item.label);
        break;
      case 'order':
        props.setSelectedOrder(item.label);
        break;
      default:
        break;
    }
  };

  return (
    <BottomSheetView style={styles.container}>
      <View marginHorizontal="auto" marginBottom="10">
        <SizableText size="$8">
          Filters
        </SizableText>
      </View>
      <BottomSheetSectionList
        sections={props.filters}
        stickySectionHeadersEnabled={true}
        keyExtractor={item => item.value}
        renderSectionHeader={({ section: { title } }) => (
          <SizableText size="$6">{title}</SizableText>
        )}
        renderItem={({ item }) => (
          <View
            style={styles.filterChipContainer}
          >
            <Button
              borderWidth={1}
              backgroundColor="white"
              borderColor={isSelected(item.label) ? Colors.primary : '#E0E0E0'}
              borderRadius={16}
              width="48%"
              paddingHorizontal={16}
              onPress={() => handleButtonPress(item, item.title)}
            >
              <SizableText size="$5">{item.label}</SizableText>
            </Button>
          </View>
        )}
      />
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  filterChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
});

export default CustomizeBottomSheetView;
