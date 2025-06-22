import { Button, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { secureStorage } from '@/utils/mmkv';
import { setAuthHeader } from '@/utils/auth-header';
import { clearUser } from '@/hooks/use-user-store';
import { router } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Profile = () => {
  const { logoutMutation } = useAuth();
  const { mutation: logout } = logoutMutation;

  const onLogout = async () => {
    await GoogleSignin.signOut();
    logout({});
    const refreshToken = secureStorage.getString('refreshToken');
    setAuthHeader(refreshToken!);
    secureStorage.delete('accessToken');
    secureStorage.delete('refreshToken');
    clearUser();
    router.replace('/(screens)/auth/login');
  };

  return (
    <SafeAreaView>
      <Text>Profile page</Text>
      <Button onPress={onLogout}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default Profile;
