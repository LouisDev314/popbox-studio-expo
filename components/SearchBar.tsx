import { Button, Input, Spinner, XStack } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useRef } from 'react';
import { IAutocompleteItem } from '@/interfaces/search';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import useDebounceInput from '@/hooks/use-debounce-input';
import { useSearch } from '@/context/search-context';
import { SearchStep } from '@/enums/search-step';

const SearchBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    isKuji,
    setAutocompleteItems,
    handleSearchBarFocus,
    handleSearch,
    step,
  } = useSearch();
  const inputRef = useRef<Input>(null);

  const debouncedQuery = useDebounceInput(searchQuery.trim(), 300);

  const { isFetching } = useCustomizeQuery({
    queryKey: [isKuji ? 'kuji' : 'product', 'autocomplete', debouncedQuery, 'fetch'],
    queryFn: () => QueryConfigs.fetchAutocomplete(debouncedQuery, isKuji),
    enabled: !!debouncedQuery,
    staleTime: 0,
    onSuccess: (data) => {
      const items = data?.data?.data as IAutocompleteItem[];
      setAutocompleteItems(items);
    },
  });

  useEffect(() => {
    if (!debouncedQuery) {
      setAutocompleteItems([]);
    }
  }, [debouncedQuery]);

  const handleFocus = () => {
    handleSearchBarFocus();
  };

  const handleClearSearchQuery = () => {
    setSearchQuery('');
  };

  return (
    <XStack
      height={40}
      alignItems="center"
      backgroundColor="white"
      borderRadius="$10"
      paddingHorizontal="$3"
      onPress={handleFocus}
    >
      {isFetching ? <Spinner size="small" color="black" /> : <Ionicons name="search-outline" color="black" size={24} />}
      <Input
        ref={inputRef}
        onPressIn={handleFocus}
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
        onSubmitEditing={() => handleSearch(searchQuery)}
        editable={step === SearchStep.OnFocus}
      />
      {searchQuery.length > 0 && (
        <Button
          size="$2"
          circular
          backgroundColor="transparent"
          onPress={handleClearSearchQuery}
          icon={<Ionicons name="close-circle-outline" color="black" size={24} />}
        />
      )}
    </XStack>
  );
};

export default SearchBar;
