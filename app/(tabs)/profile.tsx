import { Button, SizableText, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';
import AppStyleSheet from '@/constants/app-stylesheet';
import { getUser } from '@/hooks/use-user-store';
import { Alert } from 'react-native';
import React from 'react';

const Profile = () => {
  const { logout } = useAuth();

  const onLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Text>Profile page</Text>
      <Text>{getUser()?.username}</Text>
      <SizableText>{getUser()?.email}</SizableText>
      <Button onPress={() => {
        Alert.alert('Confirm Logout', 'Log out of PopBox?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: onLogout,
          },
        ]);
      }}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default Profile;
