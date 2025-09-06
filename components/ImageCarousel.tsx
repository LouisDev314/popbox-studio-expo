import { Image, View } from 'tamagui';
import { useSharedValue } from 'react-native-reanimated';
import { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { useCallback, useRef } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel/src/components/Carousel';
import Colors from '@/constants/colors';

interface IImageCarouselProps {
  imgUrls: string[];
}

const ImageCarousel = (props: IImageCarouselProps) => {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const width = Dimensions.get('window').width;

  const onPressPagination = useCallback((index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - Math.round(progress.get()),
      animated: true,
    });
  }, []);

  return (
    <View marginTop={-40}>
      <Carousel
        ref={ref}
        width={width}
        height={450}
        data={props.imgUrls}
        onProgressChange={progress}
        mode="parallax"
        renderItem={({ item }) => (
          <View style={{
            flex: 1,
            borderRadius: 15,
          }}>
            <Image
              source={{ uri: item }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 15,
              }}
            />
          </View>
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={props.imgUrls}
        activeDotStyle={{ backgroundColor: Colors.primary }}
        dotStyle={{ backgroundColor: Colors.grey, borderRadius: 50 }}
        containerStyle={{ gap: 8, marginTop: -20 }}
        onPress={onPressPagination}
      />
    </View>
  );
};

export default ImageCarousel;
