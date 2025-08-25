import AppStyleSheet from '@/constants/app-stylesheet';
import { Button, View, XStack } from 'tamagui';
import { Animated, StyleSheet } from 'react-native';
import SearchFocusScreen from '@/app/(screens)/search/SearchFocusScreen';
import React, { useRef } from 'react';
import { SearchStep } from '@/enums/search-step';
import Colors from '@/constants/colors';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import SearchInitScreen from '@/app/(screens)/search/SearchInitScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchBar from '@/components/SearchBar';
import AnimatedHeader from '@/components/AnimatedHeader';
import { HEADER_HEIGHT } from '@/constants/app';
import { useSearch } from '@/context/search-context';

const Search = () => {
  const { step, setStep, setSearchQuery, setIsKuji, isKuji } = useSearch();
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleReturn = () => {
    setSearchQuery('');
    setStep(SearchStep.Init);
  };

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
          <SearchBar />
        </View>
      </XStack>
      <View style={styles.segmentContainer}>
        <SegmentedControl
          style={styles.segmentedControl}
          tintColor={Colors.primary}
          backgroundColor="white"
          // TODO: Segmented Control -> ['Products', 'Ichiban Kuji']
          values={['Products']}
          selectedIndex={+isKuji}
          onChange={(event) => {
            setIsKuji(Boolean(event.nativeEvent.selectedSegmentIndex));
          }}
        />
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
        <SearchFocusScreen />}
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
