import { Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyleSheet from '@/constants/app-stylesheet';

const Kuji = () => {
  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Text>Kuji page</Text>
    </SafeAreaView>
  );
};

export default Kuji;
