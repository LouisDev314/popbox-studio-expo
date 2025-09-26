import { Image, SizableText, View } from 'tamagui';
import React, { useRef } from 'react';
import AppStyleSheet from '@/constants/app-stylesheet';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { Animated, StyleSheet } from 'react-native';
import TrendingItemList from '@/components/Item/TrendingItemList';
import DynamicHeader from '@/components/DynamicHeader';
import { MAX_HEADER_HEIGHT } from '@/constants/app';
import ItemTypeSelector from '@/components/ItemTypeSelector';

const Home = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  const scrollY = useRef(new Animated.Value(0)).current;

  if (!isAuthLoading && !isAuthenticated) {
    return <Redirect href="/(screens)/auth/LoginScreen" />;
  }

  // TODO: Segmented Control -> ['Products', 'Ichiban Kuji']
  return (
    <View style={AppStyleSheet.bg}>
      <DynamicHeader
        scrollY={scrollY}
        header={
          <View>
            <Image style={styles.logoContainer} source={{
              uri: require('@/assets/images/logo.png'),
            }} />
            <View style={styles.segmentContainer}>
              <ItemTypeSelector />
            </View>
          </View>
        }
      />
      {/* Sticky title */}
      <Animated.View style={{
        transform: [{
          translateY: scrollY.interpolate({
            inputRange: [0, 120],
            outputRange: [MAX_HEADER_HEIGHT + 20, 50], // Start below header, move to top snap point
            extrapolate: 'clamp',
          }),
        }],
      }}>
        <SizableText fontSize={38} fontWeight="bold" paddingTop={15}>Trending</SizableText>
      </Animated.View>
      <TrendingItemList scrollY={scrollY} />
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
  segmentContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
});

export default Home;
