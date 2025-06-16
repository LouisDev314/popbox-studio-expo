import { SizableText } from 'tamagui';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { bgStyleSheet } from '@/constants/stylesheets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';

const Home = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(screens)/auth/login" />;
  }

  return (
    <SafeAreaView style={bgStyleSheet.container}>
      <SizableText size="$8">Home Page</SizableText>
    </SafeAreaView>
  );
};

export default Home;
