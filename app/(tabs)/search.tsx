import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';
import { View } from 'tamagui';
import { StyleSheet } from 'react-native';
import SearchFocusScreen from '@/app/(screens)/search/SearchFocusScreen';
import React, { useState } from 'react';
import { SearchStep } from '@/enums/search-step';
import Colors from '@/constants/colors';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import SearchInitScreen from '@/app/(screens)/search/SearchInitScreen';

const Search = () => {
  const [step, setStep] = useState(SearchStep.Init);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isKuji = selectedIndex === 1;

  const handleSearchFocus = () => {
    setStep(SearchStep.OnFocus);
  };

  const handleReturn = () => {
    setStep(SearchStep.Init);
  };

  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <View style={styles.searchBarContainer}>

      </View>
      <View style={styles.segmentContainer}>
        <SegmentedControl
          style={styles.segmentedControl}
          tintColor={Colors.primary}
          backgroundColor="white"
          values={['Products', 'Ichiban Kuji']}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
      {step === SearchStep.Init ? <SearchInitScreen isKuji={isKuji} /> : <SearchFocusScreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    margin: 12,
  },
  searchBar: {
    width: '100%',
    borderRadius: 24,
  },
  segmentContainer: {
    alignItems: 'center',
  },
  segmentedControl: {
    width: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    // Ensure border radius is visible
    overflow: 'hidden',
    fontWeight: 'bold',
  },
});

export default Search;
