import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';
import SearchBar from 'react-native-dynamic-search-bar';
import { SizableText, View } from 'tamagui';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

const Search = () => {
  const [search, setSearch] = useState('');

  // TODO: search debounce
  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder="Search"
          onChangeText={(text) => setSearch(text)}
          onClearPress={() => setSearch('')}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.searchBar}
        />
      </View>
      <View>
        <SizableText>History</SizableText>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    margin: 12,
  },
  searchBar: {
    width: '100%',
    borderRadius: 24,
  },
});

export default Search;
