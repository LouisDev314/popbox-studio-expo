import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '@/interfaces/user';
import { AuthError, onAuthStateChanged, UserCredential } from 'firebase/auth';
import { auth } from '@/configs/firebase';
import retrieveDeviceId from '@/utils/device-id';
import { initializeSecureStorage, secureStorage } from '@/utils/mmkv';
import { StorageKey } from '@/enums/mmkv';
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
import { handleLogout } from '@/api/app-client';
import { useSetUser } from '@/hooks/use-user-store';

interface IAuthContext {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  register: UseMutateFunction<UserCredential, AuthError, { email: string, password: string }, unknown>;
  createUser: UseMutateFunction<AxiosResponse<IBaseApiResponse<IUser>>, AxiosError<unknown>, unknown, unknown>;
  isRegisterPending: boolean;
  login: UseMutateFunction<UserCredential, AuthError, { email: string, password: string }, unknown>;
  isLoginPending: boolean;
  fetchUser: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<IBaseApiResponse<IUser>>, AxiosError<IBaseApiResponse<unknown>>>>;
  isFetchingUser: boolean;
  resetLogin: () => void;
  isError: boolean;
  logout: () => Promise<void>;
  isStorageReady: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isStorageReady, setIsStorageReady] = useState(false);

  const setUser = useSetUser();

  useEffect(() => {
    const initStorage = async () => {
      await initializeSecureStorage();
      setIsStorageReady(true);
    };
    initStorage();
  }, []);

  useEffect(() => {
    if (!isStorageReady) return; // Wait for storage to be ready

    const initializeDeviceId = async () => {
      try {
        const deviceId = await retrieveDeviceId();
        if (deviceId) secureStorage().set(StorageKey.DeviceId, deviceId);
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
        fetchUser();
      } else {
        setIsAuthenticated(false);
      }
      setIsAuthLoading(false);
    });
  }, []);

  // Firebase EmailScreen/PasswordScreen registration
  const {
    mutate: register,
    isPending: isFirebaseRegisterPending,
    isError: isRegisterError,
  } = useCreateUserWithEmailAndPasswordMutation(auth, {
    onSuccess: () => {
      createUser({});
    },
    onError: (err) => {
      console.error('Firebase RegisterInitScreen error:', err);
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

  // Firebase EmailScreen/PasswordScreen sign in
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
      console.log('Firebase LoginScreen error:', err);
    },
  });

  // Login query - fetch user data from backend after Firebase auth
  const { refetch: fetchUser, isFetching: isFetchingUser, isError: isFetchingError } = useCustomizeQuery({
    queryKey: ['user', 'fetch'],
    queryFn: () => QueryConfigs.fetchUser(auth.currentUser?.uid!),
    onSuccess: (data: AxiosResponse<IBaseApiResponse<IUser>>) => {
      const user = data.data.data as IUser;
      // FIXME
      setUser(user);
      router.replace(AppScreen.Tabs);
    },
    onError: (err: AxiosError<IBaseApiResponse>) => {
      console.error('Cannot fetch user:', err);
    },
    enabled: isAuthenticated,
  });

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
    logout: handleLogout,
    isStorageReady,
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
