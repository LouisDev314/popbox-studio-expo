import { Button, Input, Spinner, XStack } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useRef } from 'react';
import { IAutocompleteItem } from '@/interfaces/search';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import useDebounceInput from '@/hooks/use-debounce-input';

interface ISearchBarProps {
  handleSearchBarFocus: () => void;
  editable: boolean;
  handleSearch: (query: string) => void;
  isKuji: boolean;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  setAutocompleteItems: (items: IAutocompleteItem[]) => void;
  autocompleteItems: IAutocompleteItem[];
}

const SearchBar = (props: ISearchBarProps) => {
  const inputRef = useRef<Input>(null);

  const debouncedQuery = useDebounceInput(props.searchQuery.trim(), 300);

  const { isFetching } = useCustomizeQuery({
    queryKey: [props.isKuji ? 'kuji' : 'product', 'autocomplete', debouncedQuery, 'fetch'],
    queryFn: () => QueryConfigs.fetchAutocomplete(debouncedQuery, props.isKuji),
    enabled: !!debouncedQuery,
    staleTime: 0,
    onSuccess: (data) => {
      const items = data?.data?.data as IAutocompleteItem[];
      props.setAutocompleteItems(items);
    },
  });

  useEffect(() => {
    if (!debouncedQuery) {
      props.setAutocompleteItems([]);
    }
  }, [debouncedQuery]);

  const handleFocus = () => {
    props.handleSearchBarFocus();
  };

  const handleClearSearchQuery = () => {
    props.setSearchQuery('');
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
        value={props.searchQuery}
        onChangeText={props.setSearchQuery}
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
        onSubmitEditing={() => props.handleSearch(props.searchQuery)}
        editable={props.editable}
      />
      {props.searchQuery.length > 0 && (
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
