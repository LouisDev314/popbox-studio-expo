import { Text, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';
import { useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { MAX_HEADER_HEIGHT } from '@/constants/app';

const Cart = () => {
  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Text>Shopping cart</Text>
      <StickyHeaderExample />
    </SafeAreaView>
  );
};

const sampleData = Array.from({ length: 30 }).map((_, i) => ({
  id: String(i),
  title: `Item ${i + 1}`,
}));

const StickyHeaderExample = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Interpolate translateY from scrollY (header moves up to -HEADER_HEIGHT)
  const translateY = scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT],
    outputRange: [0, -MAX_HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  // Interpolate opacity from scrollY (from 1 to 0)
  const opacity = scrollY.interpolate({
    inputRange: [0, MAX_HEADER_HEIGHT / 2, MAX_HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <View style={styles.item}>
      <Text>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <Text style={styles.headerTitle}>Sticky Header</Text>
      </Animated.View>

      {/* Scrollable List */}
      <Animated.FlatList
        contentContainerStyle={{ paddingTop: MAX_HEADER_HEIGHT }}
        data={sampleData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    position: 'absolute',
    top: 0,
    height: MAX_HEADER_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: '#3b5998', // Instagram blue-ish color
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000, // for android
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});


export default Cart;
