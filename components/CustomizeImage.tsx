import FastImage, { ImageStyle } from 'react-native-fast-image';
import { StyleProp } from 'react-native';

interface ICustomizeImageProps {
  uri: string,
  style?: StyleProp<ImageStyle>
}

const CustomizeImage = (props: ICustomizeImageProps) => {
  return (
    <FastImage
      style={props.style}
      source={{
        uri: props.uri,
        priority: FastImage.priority.high,
        // cache: FastImage.cacheControl.immutable,
      }}
      // resizeMode={FastImage.resizeMode.contain}
    />
  );
};

export default CustomizeImage;
