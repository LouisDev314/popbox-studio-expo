import { useLocalSearchParams } from 'expo-router';
import { Text, View, YStack } from 'tamagui';
import AppStyleSheet from '@/constants/app-stylesheet';
import { IKujiCard, IProductCard } from '@/interfaces/items';
import CustomizeHeaderBack from '@/components/CustomizeHeaderBack';
import React from 'react';

const SearchResultScreen = () => {
  const { results } = useLocalSearchParams();
  const items: IProductCard[] | IKujiCard[] | [] = results ? JSON.parse(results as string) : [];

  return (
    <View style={AppStyleSheet.bg}>
      <Text>Search results</Text>
      <CustomizeHeaderBack title="Login" />
      {/* TODO: use scrollView to show the fixed max 20 results as item cards */}
      <YStack alignItems="center">
        {items.length > 0 ? items.map(item => (
          <Text color="red" key={item._id}>{item.title}</Text>
        )) : (
          <Text>No results</Text>
        )}
      </YStack>
    </View>
  );
};

export default SearchResultScreen;
