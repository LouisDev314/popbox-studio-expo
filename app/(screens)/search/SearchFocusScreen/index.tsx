import { useEffect, useState } from 'react';
import { IAutocompleteItem } from '@/interfaces/search';
import { Button, debounce, ScrollView, SizableText, View, XStack } from 'tamagui';
import useSearchHistory from '@/hooks/use-search-history';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '@/constants/colors';
import { useHistoryStore } from '@/hooks/use-search-history-store';

interface ISearchFocusScreenProps {
  handleSearch: (query: string) => void;
}

const SearchFocusScreen = (props: ISearchFocusScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteItems, setAutocompleteItems] = useState<IAutocompleteItem[]>([]);
  const history = useHistoryStore(state => state.history);

  const {
    loadHistory,
    removeFromHistory,
    clearHistory,
  } = useSearchHistory();

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setAutocompleteItems([]);
      return;
    }

    debounce(() => {
      try {
        // TODO: Replace with your actual API call
        // const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(searchQuery)}`);
        // const data = await response.json();
        // setAutocompleteItems(data.suggestions || []);

        // Mock data for demonstration
        const mockSuggestions: IAutocompleteItem[] = [
          { id: '1', text: `${searchQuery} suggestion 1` },
          { id: '2', text: `${searchQuery} suggestion 2` },
          { id: '3', text: `${searchQuery} suggestion 3` },
        ];
        setAutocompleteItems(mockSuggestions);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setAutocompleteItems([]);
      }
    }, 300);
  }, [searchQuery]);

  return (
    <View>
      <XStack alignItems="center" justifyContent="space-between">
        <SizableText size="$9" fontWeight="bold">History</SizableText>
        {history.length > 0 && (
          <Button marginTop={8} size="$2" backgroundColor="transparent" onPress={clearHistory}>
            <SizableText size="$6" color={Colors.primary}>Clear</SizableText>
          </Button>
        )}
      </XStack>
      <ScrollView marginTop={8} height="100%" bounces={false}>
        {searchQuery.trim() === '' ? history.map(item => (
          <Button
            key={item.timestamp}
            onPress={() => props.handleSearch(item.query)}
            unstyled
            backgroundColor="transparent"
            paddingVertical={8}
            paddingHorizontal={12}
            pressStyle={{
              backgroundColor: 'grey',
            }}
          >
            <XStack
              justifyContent="space-between"
              alignItems="center"
            >
              <SizableText fontSize="$7">
                {item.query}
              </SizableText>
              <Button
                circular
                backgroundColor="transparent"
                size="$2"
                onPress={() => removeFromHistory(item.query)}
              >
                <Ionicons
                  name="close-outline"
                  color="white"
                  size={20}
                />
              </Button>
            </XStack>
          </Button>
        )) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchFocusScreen;
