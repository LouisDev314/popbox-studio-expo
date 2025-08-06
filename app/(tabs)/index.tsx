import { Image, Text, ToggleGroup } from 'tamagui';
import React, { useState } from 'react';
import AppStyleSheet from '@/constants/app-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';
import ProductList from '@/components/Product/ProductList';

type toggleGroupType = 'product' | 'kuji';

const Home = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  const [toggleGroupItem, setToggleGroupItem] = useState<toggleGroupType>('product');

  if (!isAuthLoading && !isAuthenticated) {
    return <Redirect href="/(screens)/auth/login" />;
  }

  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Image style={styles.logoContainer} source={{
        uri: require('@/assets/images/logo.png'),
      }} />
      <ToggleGroup
        value={toggleGroupItem}
        onValueChange={(val: toggleGroupType) => setToggleGroupItem(val)}
        aria-label="Toggle group example"
        type="single"
        style={{ height: 40, alignItems: 'center' }}
      >
        <ToggleGroup.Item value="kuji" aria-label="Left aligned">
          <Text>Ichiban Kuji</Text>
        </ToggleGroup.Item>
        <ToggleGroup.Item value="product" aria-label="Right aligned">
          <Text>Products</Text>
        </ToggleGroup.Item>
      </ToggleGroup>
      <ProductList isKuji={toggleGroupItem === 'kuji'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 200,
    height: 70,
    marginHorizontal: 'auto',
  },
});

export default Home;
