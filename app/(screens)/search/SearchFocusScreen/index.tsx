import { useEffect, useState } from 'react';
import { IAutocompleteItem } from '@/interfaces/search';
import { Button, debounce, SizableText, View } from 'tamagui';
import useSearchHistory from '@/hooks/use-search-history';

interface ISearchFocusScreenProps {
  handleSearch: (query: string) => void;
}

const SearchFocusScreen = (props: ISearchFocusScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteItems, setAutocompleteItems] = useState<IAutocompleteItem[]>([]);

  const {
    loadHistory,
    history,
    addToHistory,
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
      <SizableText size="$5">History</SizableText>
      {history.map(item => (
        <Button key={item.timestamp} onPress={() => props.handleSearch(item.query)}>
          {item.query}
        </Button>
      ))}
    </View>
  );
};

export default SearchFocusScreen;
