import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearUser } from '@/hooks/use-user-store';
import { secureStorage } from '@/utils/mmkv';
import { router } from 'expo-router';

interface IAuthContext {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = secureStorage.getString('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const logout = () => {
    secureStorage.delete('accessToken');
    secureStorage.delete('refreshToken');
    clearUser();
    setIsAuthenticated(false);
    router.replace('/(screens)/auth/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
