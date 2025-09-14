import { Button, ScrollView, SizableText, XStack } from 'tamagui';
import useSearchHistory from '@/hooks/use-search-history';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '@/constants/colors';
import { useSearch } from '@/context/search-context';
import AutocompleteItemList from '@/components/AutocompleteItemList';
import { ISearchHistoryItem } from '@/interfaces/search';
import { useHistoryStore } from '@/hooks/use-search-history-store';
import { SearchStep } from '@/enums/search-step';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';

const SearchFocusScreen = () => {
  const { handleSearchByItem, setStep, searchQuery, setSearchQuery } = useSearch();
  const { removeFromHistory, clearHistory, addToHistory } = useSearchHistory();
  // Reactive
  const history = useHistoryStore(state => state.history);

  const handleHistoryItemOnPress = (item: ISearchHistoryItem) => {
    if (item._id) {
      handleSearchByItem({ _id: item._id, title: item.query });
    } else {
      addToHistory(item.query);
      setSearchQuery(item.query);
      Keyboard.dismiss();
      setStep(SearchStep.Result);
    }
  };

  return (
    <>
      <XStack alignItems="center" justifyContent="space-between">
        {!searchQuery && <SizableText size="$9" fontWeight="bold">History</SizableText>}
        {!searchQuery && history.length > 0 && (
          <Button size="$2" unstyled marginRight={-4} onPress={clearHistory}>
            <SizableText size="$6" color={Colors.primary}>Clear</SizableText>
          </Button>
        )}
      </XStack>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0} // adjust offset as needed
      >
        <ScrollView marginTop={8} height="100%" keyboardShouldPersistTaps="handled">
          {!searchQuery ? history.map(item => (
            <XStack
              key={item.timestamp}
              onPress={() => handleHistoryItemOnPress(item)}
              backgroundColor="transparent"
              paddingVertical={4}
              paddingHorizontal={8}
              pressStyle={{
                backgroundColor: 'grey',
              }}
              justifyContent="space-between"
              alignItems="center"
            >
              <SizableText fontSize="$6" ellipse={true} maxWidth="85%">
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
          )) : <AutocompleteItemList />
          }
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SearchFocusScreen;
