import React, { createContext, useContext, useState } from 'react';
import useCustomizeMutation from '@/app/hooks/use-customize-mutation';
import { MutationConfigs } from '@/app/api/configs/mutation-config';
import { AxiosResponse } from 'axios';
import { IBaseApiResponse } from '@/app/interfaces/api-response';
import { IUser } from '@/app/models/user';
import { useUserStore } from '@/app/store/user-store';
import { Keyboard } from 'react-native';
import ITokens from '@/app/interfaces/tokens';

interface IAuthContext {
  isLoggedIn: boolean;
  login: (user: { email: string, password: string } | { username: string, password: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const setUser = useUserStore((state) => state.setUser);

  const { mutation: loginMutation, isPending } = useCustomizeMutation({
    mutationFn: MutationConfigs.login,
    onSuccess: async (data: AxiosResponse<IBaseApiResponse<IUser & ITokens>>) => {
      // TODO: set tokens
      setUser(data.data.data);
      setIsLoggedIn(true);
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
    // TODO: delete tokens from mmkv
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
