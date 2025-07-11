import { Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';

const Search = () => {
  // TODO: search debounce
  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Text>Search Page</Text>
    </SafeAreaView>
  );
};

export default Search;
