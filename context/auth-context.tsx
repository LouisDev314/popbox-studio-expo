import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IUser } from '@/models/user';
import { clearUser, setUser } from '@/hooks/use-user-store';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useCreateUserWithEmailAndPasswordMutation } from '@tanstack-query-firebase/react/auth';
import { auth } from '@/configs/firebase';
import retrieveDeviceId from '@/utils/device-id';
import { secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import useCustomizeQuery from '@/hooks/use-customize-query';
import QueryConfigs from '@/configs/api/query-config';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import MutationConfigs from '@/configs/api/mutation-config';
import { AxiosError, AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { AppScreen } from '@/enums/screens';
import { QueryObserverResult, RefetchOptions, UseMutateFunction } from '@tanstack/react-query';

interface IAuthContext {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  createUser: UseMutateFunction<AxiosResponse<IBaseApiResponse<IUser>, any>, AxiosError<unknown, any>, unknown, unknown>;
  fetchUser: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<IBaseApiResponse<IUser>, any>, AxiosError<IBaseApiResponse<unknown>, any>>>;
  isFetchingUser: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Initialize device ID once
  useEffect(() => {
    const initializeDeviceId = async () => {
      try {
        const deviceId = await retrieveDeviceId();
        if (deviceId) secureStorage.set(StorageKey.DeviceId, deviceId);
      } catch (error) {
        console.error('Failed to set device ID:', error);
      }
    };
    initializeDeviceId();
  }, []);

  // Auth state listener
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const storedUser = secureStorage.getString(StorageKey.User);
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsAuthLoading(false);
    });
  }, []);

  // Register mutation - create user in backend
  const { mutation: createUser, isPending: isRegistering } = useCustomizeMutation({
    mutationFn: MutationConfigs.createUser,
    onSuccess: (data: AxiosResponse<IBaseApiResponse<IUser>>) => {
      setUser(data.data.data);
      router.replace(AppScreen.Tabs);
    },
    onError: (error) => {
      console.error('Registration error:', error.response?.data);
    },
  });

  // Login query - fetch user data from backend after Firebase auth
  const { refetch: fetchUser, isFetching: isFetchingUser } = useCustomizeQuery({
    queryKey: ['user', 'fetch'],
    queryFn: () => QueryConfigs.fetchUser(auth.currentUser?.uid!),
    onSuccess: (data: AxiosResponse<IBaseApiResponse<IUser>>) => {
      const user = data.data.data as IUser;
      setUser(user);
      secureStorage.set(StorageKey.User, JSON.stringify(user));
      router.replace(AppScreen.Tabs);
    },
    onError: (err: AxiosError<IBaseApiResponse>) => {
      console.error('Internal Server fetch user error:', err);
    },
    enabled: false, // Only run when manually triggered
  });

  // TODO: implement firebase register & db create user
  // Firebase email/password registration
  const {
    mutate: firebaseCreateUserMutation,
    isPending: isFirebaseCreateUserPending,
    isError: isFirebaseCreateUserError,
  } = useCreateUserWithEmailAndPasswordMutation(auth, {
    onSuccess: () => {
      createUser({});
    },
    onError: (err) => {
      console.error('Firebase register error:', err);
    },
  });

  // TODO: implement firebase register & db create user
  const register = useCallback((email: string, password: string) => {
    firebaseCreateUserMutation({ email, password });
  }, [firebaseCreateUserMutation]);

  const logout = useCallback(async () => {
    try {
      // Sign out from Google
      await GoogleSignin.signOut();
      // Sign out from Firebase
      await signOut(auth);
      // Clear stored user data
      clearUser();
      secureStorage.clearAll();
      router.replace(AppScreen.Login);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  const contextValue: IAuthContext = {
    isAuthenticated,
    isAuthLoading,
    createUser,
    fetchUser,
    isFetchingUser,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
