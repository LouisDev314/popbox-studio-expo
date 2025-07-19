import { Button, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';
import AppStyleSheet from '@/constants/app-stylesheet';
import { getUser } from '@/hooks/use-user-store';

const Profile = () => {
  const { logout } = useAuth();

  const onLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Text>Profile page</Text>
      <Text>{getUser()?.username}</Text>
      <Button onPress={onLogout}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default Profile;
