import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  baptismal_name?: string;
  role: string;
  preferred_language: 'am' | 'gez' | 'en';
  theme_preference: string;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: 'am' | 'gez' | 'en';
  setLanguage: (lang: 'am' | 'gez' | 'en') => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  language: 'am',
  setLanguage: () => {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [language, setLanguageState] = useState<'am' | 'gez' | 'en'>('am');

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('@tewahedo_user');
      const savedLang = await AsyncStorage.getItem('@tewahedo_language');
      if (savedLang) {
        setLanguageState(savedLang as 'am' | 'gez' | 'en');
      }
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        try {
          const profile = await api.getProfile();
          setUser(profile as UserProfile);
          await AsyncStorage.setItem('@tewahedo_user', JSON.stringify(profile));
        } catch {}
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = (lang: 'am' | 'gez' | 'en') => {
    setLanguageState(lang);
    AsyncStorage.setItem('@tewahedo_language', lang);
  };

  const login = async (credentials: { email: string; password: string }) => {
    const res: any = await api.login(credentials);
    if (res.user) {
      setUser(res.user);
    }
  };

  const register = async (data: any) => {
    const res: any = await api.register(data);
    if (res.tokens?.access) {
      await AsyncStorage.setItem('@tewahedo_access_token', res.tokens.access);
      await AsyncStorage.setItem('@tewahedo_refresh_token', res.tokens.refresh);
      await AsyncStorage.setItem('@tewahedo_user', JSON.stringify(res.user));
      setUser(res.user);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile as UserProfile);
      await AsyncStorage.setItem('@tewahedo_user', JSON.stringify(profile));
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        language,
        setLanguage,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
