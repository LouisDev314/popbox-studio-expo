import { SizableText, View } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';

const Kuji = () => {
  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <View alignItems="center" justifyContent="center" height="100%">
        <SizableText size="$9">Coming Soon</SizableText>
      </View>
    </SafeAreaView>
  );
};

export default Kuji;
