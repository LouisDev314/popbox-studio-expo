import { useEffect, useState } from 'react';
import { Button, ScrollView, SizableText, View, XStack } from 'tamagui';
import useSearchHistory from '@/hooks/use-search-history';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '@/constants/colors';
import { useHistoryStore } from '@/hooks/use-search-history-store';
import { StyleSheet } from 'react-native';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import { AxiosError } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { useSearch } from '@/context/search-context';
import { IAutocompleteItem } from '@/interfaces/search';

const SearchFocusScreen = () => {
  const { searchQuery, handleSearch, autocompleteItems, isKuji } = useSearch();
  const history = useHistoryStore(state => state.history);
  const [itemId, setItemId] = useState('');

  const {
    loadHistory,
    removeFromHistory,
    clearHistory,
    addToHistory,
  } = useSearchHistory();

  useEffect(() => {
    loadHistory();
  }, []);

  const { refetch: fetchProductById } = useCustomizeQuery({
    queryKey: ['id', 'product', 'fetch'],
    queryFn: () => QueryConfigs.fetchItemById(itemId, isKuji),
    onSuccess: (data) => {
      // TODO: push the detailed item screen
    },
    onError: (err: AxiosError<IBaseApiResponse>) => {
      console.error('Cannot fetch user:', err);
    },
    enabled: false,
  });

  const handleSearchById = (item: IAutocompleteItem) => {
    addToHistory(item.title);
    setItemId(item._id);
    fetchProductById();
  };

  return (
    <View>
      <XStack alignItems="center" justifyContent="space-between">
        {!searchQuery.trim() && <SizableText size="$9" fontWeight="bold">History</SizableText>}
        {!searchQuery.trim() && history.length > 0 && (
          <Button size="$2" unstyled marginRight={-4} onPress={clearHistory}>
            <SizableText size="$6" color={Colors.primary}>Clear</SizableText>
          </Button>
        )}
      </XStack>
      <ScrollView marginTop={8} height="100%" keyboardShouldPersistTaps="handled">
        {!searchQuery.trim() ? history.map(item => (
          <Button
            key={item.timestamp}
            onPress={() => handleSearch(item.query)}
            unstyled
            backgroundColor="transparent"
            paddingVertical={4}
            paddingHorizontal={12}
            pressStyle={{
              backgroundColor: 'grey',
            }}
          >
            <XStack
              justifyContent="space-between"
              alignItems="center"
            >
              <SizableText fontSize="$6" ellipse={true} maxWidth="80%">
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
          <>
            {autocompleteItems?.map(item => (
              <XStack key={item._id} alignItems="center" justifyContent="space-between"
                      onPress={() => handleSearchById(item)}
                      pressStyle={{ backgroundColor: 'grey' }}>
                <SizableText
                  paddingVertical={8}
                  paddingHorizontal={12}
                  size="$6"
                >
                  {item.title}
                </SizableText>
                <Ionicons name="arrow-up-outline" color="white" size={20} style={styles.arrow} />
              </XStack>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  arrow: {
    transform: [{ rotate: '45deg' }],
  },
});

export default SearchFocusScreen;
