import { useEffect, useState } from 'react';
import { IAutocompleteItem } from '@/interfaces/search';
import { Button, debounce, SizableText, View } from 'tamagui';
import useSearchHistory from '@/hooks/use-search-history';
import { Keyboard } from 'react-native';
import { router } from 'expo-router';
import { AppScreen } from '@/enums/screens';

const SearchFocusScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteItems, setAutocompleteItems] = useState<IAutocompleteItem[]>([]);

  const {
    loadHistory,
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  } = useSearchHistory();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addToHistory(query);
      Keyboard.dismiss();
      router.push({
        pathname: AppScreen.SearchResult,
      });
      // TODO: Add search API call and push Search Result Screen
    }
  };

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
        <Button key={item.timestamp} onPress={() => handleSearch(item.query)}>
          {item.query}
        </Button>
      ))}
    </View>
  );
};

export default SearchFocusScreen;
