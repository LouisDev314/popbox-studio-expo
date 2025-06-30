import React, { createContext, useContext, useEffect, useState } from 'react';
import { secureStorage } from '@/utils/mmkv';
import { router } from 'expo-router';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import { MutationConfigs } from '@/api/configs/mutation-config';
import { AxiosError, AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';
import ITokens from '@/interfaces/tokens';
import { UseMutateFunction } from '@tanstack/react-query';
import { removeAuthHeader, setHeaderDeviceId } from '@/utils/auth-header';
import handleLoginSuccess from '@/app/(screens)/auth/login/login-success.handler';
import { StorageKey } from '@/enums/storage';
import { clearUser } from '@/hooks/use-user-store';

type LoginMutationType = {
  mutation: UseMutateFunction<
    AxiosResponse<IBaseApiResponse<{ user: IUser; tokens: ITokens }>>,
    AxiosError<unknown, unknown>,
    { email: string; password: string } | { username: string; password: string },
    unknown
  >;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
};

type LogoutMutationType = {
  mutation: UseMutateFunction<
    AxiosResponse<IBaseApiResponse<unknown>>,
    AxiosError<unknown, unknown>,
    unknown,
    unknown
  >;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
};

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loginMutation: LoginMutationType;
  logoutMutation: LogoutMutationType;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = secureStorage.getString(StorageKey.AccessToken);
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const setDeviceId = async () => {
      await setHeaderDeviceId();
    };
    setDeviceId();
  }, []);

  const loginMutation = useCustomizeMutation({
    mutationFn: MutationConfigs.login,
    onSuccess: (data: AxiosResponse<IBaseApiResponse<{ user: IUser; tokens: ITokens }>>) => {
      handleLoginSuccess(data);
      setIsAuthenticated(true);
      router.replace('/(tabs)');
    },
    onError: (err) => {
      console.log('err:', err.response?.data);
      // InfoAlert({ title: 'Invalid username or password', description: 'Please try again' });
    },
  });

  const logoutMutation = useCustomizeMutation({
    mutationFn: MutationConfigs.logout,
    onSuccess: () => {
      removeAuthHeader();
      secureStorage.delete(StorageKey.AccessToken);
      secureStorage.delete(StorageKey.RefreshToken);
      clearUser();
      router.replace('/(screens)/auth/login');
    },
    onError: (err) => {
      console.log('err:', err.response?.data);
    },
  });

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loginMutation, logoutMutation }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
