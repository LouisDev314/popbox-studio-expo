import { Stack } from 'expo-router';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import tamaguiConfig from '@/app/constants/tamagui.config';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AnimatedSplash from '@/app/components/AnimatedSplash';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { secureStorage } from '@/app/utils/mmkv';

const config = createTamagui({ ...defaultConfig, ...tamaguiConfig });

const queryClient = new QueryClient();

// Catch any errors thrown by the Layout component
export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Hide the native splash screen as soon as the app loads
    SplashScreen.hideAsync();
    const token = secureStorage.getString('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleSplashFinish = () => {
    setIsSplashVisible(false); // Remove the custom splash screen
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <StatusBar style="light" />
        <Stack initialRouteName={isAuthenticated ? '(tabs)' : '(screens)/login'}>
          <Stack.Screen name="(screens)/login" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/*<Stack.Screen name="product/[id]" options={{ headerShown: false }} />*/}
        </Stack>
        {isSplashVisible && <AnimatedSplash onFinish={handleSplashFinish} />}
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
