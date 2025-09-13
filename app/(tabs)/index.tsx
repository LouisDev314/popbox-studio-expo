import { Image, SizableText, View } from 'tamagui';
import React, { useRef, useState } from 'react';
import AppStyleSheet from '@/constants/app-stylesheet';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { Animated, StyleSheet } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Colors from '@/constants/colors';
import TrendingItemList from '@/components/Item/TrendingItemList';
import DynamicHeader from '@/components/DynamicHeader';
import { MAX_HEADER_HEIGHT } from '@/constants/app';

const Home = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isKuji = selectedIndex === 1;

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
              <SegmentedControl
                style={styles.segmentedControl}
                tintColor={Colors.primary}
                backgroundColor="white"
                values={['Products']}
                selectedIndex={selectedIndex}
                onChange={(event) => {
                  setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                }}
              />
            </View>
          </View>
        }
      />
      {/* Sticky title */}
      <Animated.View style={{
        transform: [{
          translateY: scrollY.interpolate({
            inputRange: [0, MAX_HEADER_HEIGHT],
            outputRange: [MAX_HEADER_HEIGHT + 20, 50], // Start below header, move to top snap point
            extrapolate: 'clamp',
          }),
        }],
      }}>
        <SizableText fontSize={35} fontWeight="bold" paddingTop={20}>Trending</SizableText>
      </Animated.View>
      <TrendingItemList scrollY={scrollY} isKuji={isKuji} />
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
    marginTop: 10,
    marginBottom: 20,
  },
  segmentedControl: {
    width: 240,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
});

export default Home;
