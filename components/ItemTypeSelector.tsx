import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Colors from '@/constants/colors';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSearch } from '@/context/search-context';

const ItemTypeSelector = () => {
  const { isKuji, setIsKuji } = useSearch();

  return (
    <SegmentedControl
      style={styles.segmentedControl}
      tintColor={Colors.primary}
      backgroundColor="white"
      values={['Products']}
      selectedIndex={+isKuji}
      onChange={(event) => {
        setIsKuji(Boolean(event.nativeEvent.selectedSegmentIndex));
      }}
    />
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  segmentedControl: {
    width: 240,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
});

export default ItemTypeSelector;
