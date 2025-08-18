import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';
import { Button, View, XStack } from 'tamagui';
import { Keyboard, StyleSheet } from 'react-native';
import SearchFocusScreen from '@/app/(screens)/search/SearchFocusScreen';
import React, { useState } from 'react';
import { SearchStep } from '@/enums/search-step';
import Colors from '@/constants/colors';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import SearchInitScreen from '@/app/(screens)/search/SearchInitScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchBar from '@/components/SearchBar';
import { router } from 'expo-router';
import { AppScreen } from '@/enums/screens';
import useSearchHistory from '@/hooks/use-search-history';

const Search = () => {
  const [step, setStep] = useState(SearchStep.Init);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {
    loadHistory,
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  } = useSearchHistory();

  const isKuji = selectedIndex === 1;

  const handleSearchBarFocus = () => {
    setStep(SearchStep.OnFocus);
  };

  const handleReturn = () => {
    setStep(SearchStep.Init);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToHistory(query);
      Keyboard.dismiss();
      router.push({
        pathname: AppScreen.SearchResult,
      });
      // TODO: Add search API call and push Search Result Screen
    }
  };

  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <XStack alignItems="center" justifyContent="space-between">
        {step === SearchStep.OnFocus &&
          <Button
            size="$1"
            backgroundColor="transparent"
            marginBottom={12}
            height="100%"
            onPress={handleReturn}
            // circular
            icon={<Ionicons name="chevron-back-outline" color="white" size={32} />}
          />
        }
        <View marginBottom={12} marginHorizontal={step === SearchStep.Init ? 12 : 0}
              width={step === SearchStep.Init ? '95%' : '90%'}>
          <SearchBar handleSearchBarFocus={handleSearchBarFocus} editable={step === SearchStep.OnFocus}
                     handleSearch={handleSearch} />
        </View>
      </XStack>
      <View style={styles.segmentContainer}>
        {step === SearchStep.Init && <SegmentedControl
          style={styles.segmentedControl}
          tintColor={Colors.primary}
          backgroundColor="white"
          values={['Products', 'Ichiban Kuji']}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />}
      </View>
      {step === SearchStep.Init ? <SearchInitScreen isKuji={isKuji} /> :
        <SearchFocusScreen handleSearch={handleSearch} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
