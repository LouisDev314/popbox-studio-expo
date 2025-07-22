import { SizableText } from 'tamagui';
import React from 'react';
import AppStyleSheet from '@/constants/app-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUser } from '@/hooks/use-user-store';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';

const Home = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  // const {
  //   data,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   isLoading,
  //   error,
  // } = useProductsInfinite(isAuthenticated);
  //
  // const products = data?.pages.flatMap(page => page.products) ?? [];
  //
  // if (isLoading) {
  //   return <ActivityIndicator size="large" />;
  // }

  // if (error) {
  //   console.log(error);
  // }

  if (!isAuthLoading && !isAuthenticated) {
    return <Redirect href="/(screens)/auth/login" />;
  }

  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <SizableText size="$8">Home Page</SizableText>
      <SizableText>{getUser()?.email}</SizableText>
      {/*<FlatList*/}
      {/*  data={products}*/}
      {/*  keyExtractor={item => item._id}*/}
      {/*  renderItem={({ item }) => (*/}
      {/*    <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>*/}
      {/*      <Image source={{ uri: item.imgUrl[0] }} style={{ width: 100, height: 100 }} />*/}
      {/*      <Text>{item.title}</Text>*/}
      {/*      <Text>${item.price}</Text>*/}
      {/*    </View>*/}
      {/*  )}*/}
      {/*  onEndReached={() => {*/}
      {/*    if (hasNextPage && !isFetchingNextPage) {*/}
      {/*      fetchNextPage();*/}
      {/*    }*/}
      {/*  }}*/}
      {/*  onEndReachedThreshold={0.5}*/}
      {/*  ListFooterComponent={*/}
      {/*    isFetchingNextPage ? <ActivityIndicator size="small" /> : null*/}
      {/*  }*/}
      {/*/>*/}
    </SafeAreaView>
  );
};

export default Home;
