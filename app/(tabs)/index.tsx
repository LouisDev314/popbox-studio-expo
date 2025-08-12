import { Button, Image, SizableText } from 'tamagui';
import React, { useCallback, useRef, useState } from 'react';
import AppStyleSheet from '@/constants/app-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import ProductList from '@/components/Product/ProductList';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import Colors from '@/constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet from '@gorhom/bottom-sheet';
import FiltersBottomSheet from '@/components/BottomSheet/Filters';
import useItemsInfinite from '@/hooks/use-items-infinite';

const Home = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const isKuji = selectedIndex === 1;

  const result = useItemsInfinite({}, isKuji, isAuthenticated);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['75%'];

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  if (!isAuthLoading && !isAuthenticated) {
    return <Redirect href="/(screens)/auth/login" />;
  }

  return (
    <SafeAreaView style={AppStyleSheet.bg}>
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
      <View style={styles.filterContainer}>
        <Button
          icon={<Ionicons name="filter-outline" color="white" size={20} />}
          onPress={handleOpenBottomSheet}
        >
          <SizableText size={'$5'}>
            Filters
          </SizableText>
        </Button>
      </View>
      <ProductList isKuji={isKuji} result={result} />
      <FiltersBottomSheet ref={bottomSheetRef} snapPoints={snapPoints} isKuji={isKuji}
                          handleCloseBottomSheet={handleCloseBottomSheet} refetch={result.refetch} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    width: 200,
    height: 70,
    marginHorizontal: 'auto',
  },
  filterContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  filter: {},
  segmentContainer: {
    alignItems: 'center',
  },
  segmentedControl: {
    width: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',        // Ensure border radius is visible
    fontWeight: 'bold',
  },
});

export default Home;
