import { Image, SizableText } from 'tamagui';
import React, { useState } from 'react';
import AppStyleSheet from '@/constants/app-stylesheet';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Colors from '@/constants/colors';
import useItemsInfinite from '@/hooks/use-items-infinite';
import TrendingItemList from '@/components/Item/TrendingItemList';

const Home = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isKuji = selectedIndex === 1;

  if (!isAuthLoading && !isAuthenticated) {
    return <Redirect href="/(screens)/auth/LoginScreen" />;
  }

  const queryResult = useItemsInfinite({}, isKuji, isAuthenticated);

  return (
    <View style={AppStyleSheet.bg}>
      <Image style={styles.logoContainer} source={{
        uri: require('@/assets/images/logo.png'),
      }} />
      <View style={styles.segmentContainer}>
        <SegmentedControl
          style={styles.segmentedControl}
          tintColor={Colors.primary}
          backgroundColor="white"
          values={['Products', 'Ichiban Kuji']}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
      <SizableText size="$9" marginVertical={8}>Trending</SizableText>
      {/* TODO: scroll up and header fades out */}
      {/*<ItemList isKuji={isKuji} queryResult={queryResult} />*/}
      <TrendingItemList />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 200,
    height: 70,
    marginHorizontal: 'auto',
    marginTop: 40,
  },
  filterContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  segmentContainer: {
    alignItems: 'center',
  },
  segmentedControl: {
    width: 240,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    // Ensure border radius is visible
    overflow: 'hidden',
    fontWeight: 'bold',
  },
});

export default Home;
