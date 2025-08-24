import { useEffect } from 'react';
import { IAutocompleteItem } from '@/interfaces/search';
import { Button, ScrollView, SizableText, View, XStack } from 'tamagui';
import useSearchHistory from '@/hooks/use-search-history';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '@/constants/colors';
import { useHistoryStore } from '@/hooks/use-search-history-store';
import { StyleSheet } from 'react-native';

interface ISearchFocusScreenProps {
  handleSearch: (query: string) => void;
  searchQuery: string;
  autocompleteItems: IAutocompleteItem[];
}

const SearchFocusScreen = (props: ISearchFocusScreenProps) => {
  const history = useHistoryStore(state => state.history);

  const {
    loadHistory,
    removeFromHistory,
    clearHistory,
  } = useSearchHistory();

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <View>
      <XStack alignItems="center" justifyContent="space-between">
        {!props.searchQuery.trim() && <SizableText size="$9" fontWeight="bold">History</SizableText>}
        {!props.searchQuery.trim() && history.length > 0 && (
          <Button size="$2" backgroundColor="transparent" onPress={clearHistory}>
            <SizableText size="$6" color={Colors.primary}>Clear</SizableText>
          </Button>
        )}
      </XStack>
      <ScrollView marginTop={8} height="100%" keyboardShouldPersistTaps="handled">
        {!props.searchQuery.trim() ? history.map(item => (
          <Button
            key={item.timestamp}
            onPress={() => props.handleSearch(item.query)}
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
              <SizableText fontSize="$6">
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
            {props.autocompleteItems?.map(item => (
              <XStack key={item._id} alignItems="center" justifyContent="space-between"
                      pressStyle={{ backgroundColor: 'red' }}>
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
