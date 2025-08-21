import { Image, View } from 'tamagui';
import React, { useRef, useState } from 'react';
import AppStyleSheet from '@/constants/app-stylesheet';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { Animated, StyleSheet } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Colors from '@/constants/colors';
import TrendingItemList from '@/components/Item/TrendingItemList';
import AnimatedHeader from '@/components/AnimatedHeader';
import { HEADER_HEIGHT } from '@/constants/app';

const Home = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isKuji = selectedIndex === 1;

  const scrollY = useRef(new Animated.Value(0)).current;

  if (!isAuthLoading && !isAuthenticated) {
    return <Redirect href="/(screens)/auth/LoginScreen" />;
  }

  return (
    <View style={AppStyleSheet.bg}>
      <AnimatedHeader
        scrollY={scrollY}
        header={
          <>
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
          </>
        } />

      {/* Content that moves up as header disappears */}
      <Animated.View style={{
        transform: [{
          translateY: scrollY.interpolate({
            inputRange: [0, HEADER_HEIGHT],
            outputRange: [HEADER_HEIGHT, 50], // Start below header, move to top snap point
            extrapolate: 'clamp',
          }),
        }],
      }}>
        <TrendingItemList scrollY={scrollY} />
      </Animated.View>
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
