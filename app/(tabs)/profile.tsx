import { Button, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { secureStorage } from '@/utils/mmkv';
import { removeAuthHeader, setAuthHeader } from '@/utils/auth-header';
import { clearUser } from '@/hooks/use-user-store';
import { router } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StorageKey } from '@/enums/storage';

const Profile = () => {
  const { logoutMutation } = useAuth();
  const { mutation: logout } = logoutMutation;

  const onLogout = async () => {
    await GoogleSignin.signOut();
    setAuthHeader(secureStorage.getString(StorageKey.RefreshToken)!);
    logout({});
    removeAuthHeader();
    secureStorage.delete(StorageKey.AccessToken);
    secureStorage.delete(StorageKey.RefreshToken);
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
