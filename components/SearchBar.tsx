import { Button, Input, XStack } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRef, useState } from 'react';

interface ISearchBarProps {
  handleSearchBarFocus: () => void;
  editable: boolean;
  handleSearch: (query: string) => void;
}

const SearchBar = (props: ISearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<Input>(null);

  let timer: NodeJS.Timeout;
  const handleFocus = () => {
    props.handleSearchBarFocus();
    // Use setTimeout to ensure the input is ready to receive focus
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      inputRef?.current?.focus();
    }, 100);
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
      <Ionicons name="search-outline" color="black" size={24} />
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
        color="black"
        onSubmitEditing={() => props.handleSearch(searchQuery)}
        editable={props.editable}
      />
      {searchQuery.length > 0 && (
        <Button
          size="$2"
          circular
          backgroundColor="transparent"
          onPress={() => setSearchQuery('')}
          icon={<Ionicons name="close-circle-outline" color="black" size={24} />}
        />
      )}
    </XStack>
  );
};

export default SearchBar;
