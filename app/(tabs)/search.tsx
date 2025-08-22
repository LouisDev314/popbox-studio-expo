import AppStyleSheet from '@/constants/app-stylesheet';
import { Button, View, XStack } from 'tamagui';
import { Animated, Keyboard, StyleSheet } from 'react-native';
import SearchFocusScreen from '@/app/(screens)/search/SearchFocusScreen';
import React, { useRef, useState } from 'react';
import { SearchStep } from '@/enums/search-step';
import Colors from '@/constants/colors';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import SearchInitScreen from '@/app/(screens)/search/SearchInitScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchBar from '@/components/SearchBar';
import useSearchHistory from '@/hooks/use-search-history';
import AnimatedHeader from '@/components/AnimatedHeader';

const HEADER_HEIGHT = 150;

const Search = () => {
  const [step, setStep] = useState(SearchStep.Init);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {
    addToHistory,
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
      // router.push({
      //   pathname: AppScreen.SearchResult,
      // });
      // TODO: Add search API call and push Search Result Screen
    }
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  const searchHeader = (
    <>
      <XStack alignItems="center" justifyContent="space-between" marginTop={60}>
        {step === SearchStep.OnFocus &&
          <Button
            size="$1"
            backgroundColor="transparent"
            marginBottom={12}
            height="100%"
            onPress={handleReturn}
            icon={<Ionicons name="chevron-back-outline" color="white" size={32} />}
          />
        }
        <View marginBottom={12} marginHorizontal={step === SearchStep.Init ? 12 : 0}
              width={step === SearchStep.Init ? '95%' : '90%'} marginRight={step === SearchStep.OnFocus ? 8 : 0}>
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
    </>
  );

  return (
    <View style={AppStyleSheet.bg}>
      {step === SearchStep.Init ? <AnimatedHeader header={searchHeader} scrollY={scrollY} /> : searchHeader}
      {step === SearchStep.Init ? (
          <Animated.View style={{
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, HEADER_HEIGHT],
                outputRange: [HEADER_HEIGHT, 50], // Start below header, move to top snap point
                extrapolate: 'clamp',
              }),
            }],
          }}>
            <SearchInitScreen isKuji={isKuji} scrollY={scrollY} />
          </Animated.View>
        ) :
        <SearchFocusScreen handleSearch={handleSearch} />}
    </View>
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
    width: 240,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    // Ensure border radius is visible
    overflow: 'hidden',
    fontWeight: 'bold',
  },
});

export default Search;
