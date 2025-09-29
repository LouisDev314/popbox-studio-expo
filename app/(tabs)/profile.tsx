import { Avatar, Button, ScrollView, SizableText, View } from 'tamagui';
import { useAuth } from '@/context/auth-context';
import AppStyleSheet from '@/constants/app-stylesheet';
import { useGetUser } from '@/hooks/use-user-store';
import { Alert, StyleSheet } from 'react-native';
import React from 'react';
import ProfileOptionList from '@/components/profile/ProfileOptionList';
import Colors from '@/constants/colors';

const Profile = () => {
  const { logout } = useAuth();

  const onLogout = async () => {
    await logout();
  };

  const user = useGetUser();

  return (
    <View style={AppStyleSheet.bg}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Avatar circular size="$11">
          <Avatar.Image
            source={{ uri: require('@/assets/images/default-avatar.png') }}
          />
          <Avatar.Fallback backgroundColor={Colors.primary} />
        </Avatar>
        <SizableText size="$7" marginTop={12}>{user?.username}</SizableText>
        <SizableText size="$5" marginBottom={20}>{user?.email}</SizableText>

        <ProfileOptionList />

        <Button
          unstyled
          marginBottom={60}
          onPress={() => {
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
          <SizableText size="$5" color={Colors.primary} marginTop="$4">Logout</SizableText>
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
  },
  contentContainer: {
    alignItems: 'center',
  },
});

export default Profile;
