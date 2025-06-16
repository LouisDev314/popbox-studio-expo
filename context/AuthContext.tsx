import React, { createContext, useContext, useEffect, useState } from 'react';
import useCustomizeMutation from '@/hooks/use-customize-mutation';
import { MutationConfigs } from '@/api/configs/mutation-config';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/interfaces/api-response';
import { IUser } from '@/models/user';
import { clearUser, setUser } from '@/hooks/use-user-store';
import { Keyboard } from 'react-native';
import ITokens from '@/interfaces/tokens';
import { secureStorage } from '@/utils/mmkv';
import { router } from 'expo-router';

interface IAuthContext {
  isAuthenticated: boolean;
  login: (user: { email: string, password: string } | { username: string, password: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = secureStorage.getString('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const { mutation: loginMutation } = useCustomizeMutation({
    mutationFn: MutationConfigs.login,
    onSuccess: async (data: AxiosResponse<IBaseApiResponse<{ user: IUser; tokens: ITokens }>>) => {
      const { tokens, user } = data.data.data;
      secureStorage.set('accessToken', tokens.accessToken);
      secureStorage.set('refreshToken', tokens.refreshToken);
      setUser(user);
      setIsAuthenticated(true);
    },
    onError: () => {
      // InfoAlert({ title: 'Invalid username or password', description: 'Please try again' });
    },
  });

  const login = (user: { email: string, password: string } | { username: string, password: string }) => {
    Keyboard.dismiss();
    loginMutation(user);
  };

  const logout = () => {
    secureStorage.delete('accessToken');
    secureStorage.delete('refreshToken');
    clearUser();
    setIsAuthenticated(false);
    router.replace('/(screens)/auth/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
