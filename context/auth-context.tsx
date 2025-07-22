import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '@/models/user';
import { clearUser, setUser } from '@/hooks/use-user-store';
import { AuthError, onAuthStateChanged, signOut, UserCredential } from 'firebase/auth';
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
import {
  useCreateUserWithEmailAndPasswordMutation,
  useSignInWithEmailAndPasswordMutation,
} from '@tanstack-query-firebase/react/auth';

interface IAuthContext {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  register: UseMutateFunction<UserCredential, AuthError, { email: string, password: string }, unknown>;
  createUser: UseMutateFunction<AxiosResponse<IBaseApiResponse<IUser>, any>, AxiosError<unknown, any>, unknown, unknown>;
  isRegisterPending: boolean;
  login: UseMutateFunction<UserCredential, AuthError, { email: string, password: string }, unknown>;
  isLoginPending: boolean;
  fetchUser: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<IBaseApiResponse<IUser>, any>, AxiosError<IBaseApiResponse<unknown>, any>>>;
  isFetchingUser: boolean;
  resetLogin: () => void;
  isError: boolean;
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

  // Firebase email/password registration
  const {
    mutate: register,
    isPending: isFirebaseRegisterPending,
    isError: isRegisterError,
  } = useCreateUserWithEmailAndPasswordMutation(auth, {
    onSuccess: () => {
      createUser({});
    },
    onError: (err) => {
      console.error('Firebase register error:', err);
    },
  });

  // Register mutation - create user in backend
  const { mutation: createUser, isPending: isCreatingUser, isError: isCreateUserError } = useCustomizeMutation({
    mutationFn: MutationConfigs.createUser,
    onSuccess: (data: AxiosResponse<IBaseApiResponse<IUser>>) => {
      setUser(data.data.data);
      router.replace(AppScreen.Tabs);
    },
    onError: (error) => {
      console.error('Registration error:', error.response?.data);
    },
  });

  // Firebase email/password sign in
  const {
    mutate: login,
    isPending: isLoginPending,
    isError: isLoginError,
    reset: resetLogin,
  } = useSignInWithEmailAndPasswordMutation(auth, {
    onSuccess: async () => {
      await fetchUser();
    },
    onError: (err) => {
      console.log('Firebase login error:', err);
    },
  });

  // Login query - fetch user data from backend after Firebase auth
  const { refetch: fetchUser, isFetching: isFetchingUser, isError: isFetchingError } = useCustomizeQuery({
    queryKey: ['user', 'fetch'],
    queryFn: () => QueryConfigs.fetchUser(auth.currentUser?.uid!),
    onSuccess: (data: AxiosResponse<IBaseApiResponse<IUser>>) => {
      const user = data.data.data as IUser;
      setUser(user);
      secureStorage.set(StorageKey.User, JSON.stringify(user));
      router.replace(AppScreen.Tabs);
    },
    onError: (err: AxiosError<IBaseApiResponse>) => {
      console.error('Cannot fetch user:', err);
    },
    enabled: false, // Only run when manually triggered
  });

  const logout = async () => {
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
  };

  const isError = isRegisterError || isLoginError || isFetchingError || isCreateUserError;
  const isRegisterPending = isFirebaseRegisterPending || isCreatingUser;

  const contextValue: IAuthContext = {
    isAuthenticated,
    isAuthLoading,
    register,
    isRegisterPending,
    login,
    isLoginPending,
    fetchUser,
    isFetchingUser,
    resetLogin,
    createUser,
    isError,
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
