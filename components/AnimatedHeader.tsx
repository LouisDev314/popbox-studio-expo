import { ReactElement } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { HEADER_HEIGHT } from '@/constants/app';

interface IAnimatedHeaderProps {
  header: ReactElement;
  scrollY: Animated.Value;
}

const AnimatedHeader = (props: IAnimatedHeaderProps) => {
  // Header translate up animation
  const headerTranslateY = props.scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  // Header fade out animation
  const headerOpacity = props.scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.7],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[
      styles.headerContainer,
      {
        opacity: headerOpacity,
        transform: [{ translateY: headerTranslateY }],
      },
    ]}>
      {props.header}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default AnimatedHeader;
