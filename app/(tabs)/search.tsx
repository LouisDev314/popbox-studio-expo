import AppStyleSheet from '@/constants/app-stylesheet';
import { View } from 'tamagui';
import { Animated } from 'react-native';
import SearchFocusScreen from '@/app/(screens)/search/SearchFocusScreen';
import React, { useRef } from 'react';
import { SearchStep } from '@/enums/search-step';
import DynamicHeader from '@/components/DynamicHeader';
import { useSearch } from '@/context/search-context';
import SearchHeader from '@/components/SearchHeader';
import SearchResultScreen from '@/app/(screens)/search/SearchResultScreen';
import SearchInitScreen from '@/app/(screens)/search/SearchInitScreen';

const Search = () => {
  const { step, setStep, isKuji, setSearchQuery } = useSearch();
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleReturn = () => {
    setSearchQuery('');
    setStep(SearchStep.Init);
  };

  const searchHeader = <SearchHeader handleReturn={handleReturn} />;

  let currentScreen;
  switch (step) {
    case SearchStep.Init:
      currentScreen = <SearchInitScreen isKuji={isKuji} scrollY={scrollY} />;
      break;
    case SearchStep.OnFocus:
      currentScreen = <SearchFocusScreen />;
      break;
    case SearchStep.Result:
      currentScreen = <SearchResultScreen />;
      break;
  }

  return (
    <View style={AppStyleSheet.bg}>
      {step === SearchStep.Init ? <DynamicHeader header={searchHeader} scrollY={scrollY} /> : searchHeader}
      <View marginBottom="$18">
        {currentScreen}
      </View>
    </View>
  );
};

export default Search;
