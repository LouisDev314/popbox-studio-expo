import { SizableText, XStack } from 'tamagui';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSearch } from '@/context/search-context';
import { StyleSheet } from 'react-native';

const AutocompleteItemList = () => {
  const { autocompleteItems, handleSearchByItem } = useSearch();

  return (
    <>
      {autocompleteItems?.map(item => (
        <XStack key={item._id} alignItems="center" justifyContent="space-between"
                onPress={() => handleSearchByItem(item)}
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
  );
};

const styles = StyleSheet.create({
  arrow: {
    transform: [{ rotate: '45deg' }],
    marginRight: 18,
  },
});

export default AutocompleteItemList;
