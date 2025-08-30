import { Button, Input, Spinner, XStack } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { IAutocompleteItem } from '@/interfaces/search';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import { useSearch } from '@/context/search-context';
import { SearchStep } from '@/enums/search-step';
import { Keyboard } from 'react-native';
import useSearchHistory from '@/hooks/use-search-history';
import Colors from '@/constants/colors';

interface ISearchBarProps {
}

const SearchBar = (props: ISearchBarProps) => {
  const {
    isKuji,
    setAutocompleteItems,
    handleSearchBarFocus,
    step,
    setStep,
    setIsSearchBarFocused,
    debouncedQuery,
    searchBarRef,
    setSearchQuery,
    searchQuery,
  } = useSearch();
  const { addToHistory } = useSearchHistory();

  const { isFetching } = useCustomizeQuery({
    queryKey: [isKuji ? 'kuji' : 'product', 'autocomplete', debouncedQuery, 'fetch'],
    queryFn: () => QueryConfigs.fetchAutocomplete(debouncedQuery, isKuji),
    onSuccess: (data) => {
      const items = data?.data?.data as IAutocompleteItem[];
      setAutocompleteItems(items);
    },
    enabled: step === SearchStep.OnFocus && !!debouncedQuery,
    staleTime: 0,
  });

  const handleClearSearchQuery = () => {
    setSearchQuery('');
    handleSearchBarFocus();
  };

  const handleSearchOnInputSubmit = (query: string) => {
    if (query.trim()) {
      addToHistory(query);
      Keyboard.dismiss();
      setStep(SearchStep.Result);
    }
  };

  return (
    <XStack
      height={40}
      alignItems="center"
      backgroundColor="white"
      borderRadius="$10"
      paddingHorizontal="$3"
    >
      {(isFetching && step !== SearchStep.Result) ? <Spinner size="small" color="black" /> :
        <Ionicons name="search-outline" color="black" size={24} />}
      <Input
        ref={searchBarRef}
        onPressIn={handleSearchBarFocus}
        onFocus={() => setIsSearchBarFocused(true)}
        onBlur={() => setIsSearchBarFocused(false)}
        flex={1}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        backgroundColor="transparent"
        borderWidth={0}
        marginLeft={-4}
        fontSize="$6"
        returnKeyType="search"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={true}
        color="black"
        onSubmitEditing={() => handleSearchOnInputSubmit(debouncedQuery)}
        editable={step !== SearchStep.Init}
      />
      {(searchQuery.length > 0) && (
        <Button
          size="$2"
          circular
          backgroundColor="transparent"
          onPress={handleClearSearchQuery}
          pressStyle={{ backgroundColor: Colors.primary }}
          icon={<Ionicons name="close-circle-outline" color="black" size={24} />}
        />
      )}
    </XStack>
  );
};

export default SearchBar;
