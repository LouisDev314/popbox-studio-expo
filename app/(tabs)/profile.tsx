import { Button, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AppStyleSheet from '@/constants/app-stylesheet';

const Profile = () => {
  const { logoutMutation } = useAuth();
  const { mutation: logout } = logoutMutation;

  const onLogout = async () => {
    await GoogleSignin.signOut();
    logout({});
  };

  return (
    <SafeAreaView style={AppStyleSheet.bg}>
      <Text>Profile page</Text>
      <Button onPress={onLogout}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default Profile;
