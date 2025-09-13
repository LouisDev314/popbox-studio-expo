import { ReactElement } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { MAX_HEADER_HEIGHT } from '@/constants/app';

interface IDynamicHeaderProps {
  header: ReactElement;
  scrollY: Animated.Value;
}

const DynamicHeader = (props: IDynamicHeaderProps) => {
  // Interpolate translateY from scrollY (header moves up to -HEADER_HEIGHT)
  const translateY = props.scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT],
    outputRange: [0, -MAX_HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  // Interpolate opacity from scrollY (from 1 to 0)
  const opacity = props.scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT / 2, MAX_HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[
      styles.header,
      {
        opacity,
        transform: [{ translateY }],
      },
    ]}>
      {props.header}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    height: MAX_HEADER_HEIGHT,
    left: 0,
    right: 0,
  },
});

export default DynamicHeader;
