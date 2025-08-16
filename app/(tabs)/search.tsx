import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';
import SearchBar from 'react-native-dynamic-search-bar';

const Search = () => {
  // TODO: search debounce
  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <SearchBar
        placeholder="Search here"
        onPress={() => alert('onPress')}
        onChangeText={(text) => console.log(text)}
      />
    </SafeAreaView>
  );
};

export default Search;
