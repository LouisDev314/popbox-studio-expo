import { SizableText } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}
    >
      <SizableText size="$8">Home Page</SizableText>
    </SafeAreaView>
  );
};

export default Index;
