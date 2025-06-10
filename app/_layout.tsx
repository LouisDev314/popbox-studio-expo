import { Stack } from 'expo-router';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import tamaguiConfig from '@/app/constants/tamagui.config';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AnimatedSplash from '@/app/components/AnimatedSplash';
import { StatusBar } from 'expo-status-bar';

const config = createTamagui({ ...defaultConfig, ...tamaguiConfig });

// Catch any errors thrown by the Layout component
export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    // Hide the native splash screen as soon as the app loads
    SplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = () => {
    setIsSplashVisible(false); // Remove the custom splash screen
  };

  return (
    <TamaguiProvider config={config}>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(screens)/login" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/*<Stack.Screen name="product/[id]" options={{ headerShown: false }} />*/}
      </Stack>
      {isSplashVisible && <AnimatedSplash onFinish={handleSplashFinish} />}
    </TamaguiProvider>
  );
}
