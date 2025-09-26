import { Button, View, XStack } from 'tamagui';
import { SearchStep } from '@/enums/search-step';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchBar from '@/components/SearchBar';
import React, { useEffect } from 'react';
import { useSearch } from '@/context/search-context';
import ItemTypeSelector from '@/components/ItemTypeSelector';
import { StyleSheet } from 'react-native';

interface ISearchHeaderProps {
  handleReturn: () => void;
}

const searchHeader = (props: ISearchHeaderProps) => {
  const { step, searchQuery, setAutocompleteItems } = useSearch();

  useEffect(() => {
    if (searchQuery) {
      setAutocompleteItems([]);
    }
  }, [searchQuery]);

  return (
    <>
      <XStack alignItems="center" justifyContent="space-between" marginTop={60}>
        {(step === SearchStep.OnFocus || step === SearchStep.Result) &&
          <Button
            size="$1"
            backgroundColor="transparent"
            marginBottom={12}
            height="100%"
            onPress={props.handleReturn}
            icon={<Ionicons name="chevron-back-outline" color="white" size={32} />}
          />
        }
        <View marginBottom={12} marginHorizontal={step === SearchStep.Init ? 12 : 0}
              width={step === SearchStep.Init ? '95%' : '90%'} marginRight={step === SearchStep.OnFocus ? 8 : 0}>
          <SearchBar />
        </View>
      </XStack>
      <View style={styles.segmentContainer}>
        <ItemTypeSelector />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    alignItems: 'center',
  },
});

export default searchHeader;
