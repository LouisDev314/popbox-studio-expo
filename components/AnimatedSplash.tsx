import React, { useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface IAnimatedSplash {
  onFinish: () => void;
}

const AnimatedSplash = (props: IAnimatedSplash) => {
  const logoOpacity = new Animated.Value(0); // Logo starts invisible
  const containerOpacity = new Animated.Value(1); // Container starts visible

  useEffect(() => {
    Animated.sequence([
      // Fade in the logo over 2 seconds
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      // Fade out the entire splash screen over 1 second
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(props.onFinish); // Call onFinish when the sequence completes
  }, [props.onFinish]);

  return (
    <Animated.View
      style={[styles.container, { opacity: containerOpacity }]}
    >
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[styles.logo, { opacity: logoOpacity }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 350,
    height: 350,
  },
});

export default AnimatedSplash;
