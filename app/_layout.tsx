import { Stack } from 'expo-router';
import { createTamagui, TamaguiProvider, Theme } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4';
import React, { useEffect, useState } from 'react';
import AnimatedSplash from '@/components/AnimatedSplash';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/context/AuthContext';

const config = createTamagui(defaultConfig);

const queryClient = new QueryClient();

const RootLayoutNav = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      {isSplashVisible && <AnimatedSplash onFinish={handleSplashFinish} />}
    </>
  );
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config}>
        <Theme name="dark">
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
