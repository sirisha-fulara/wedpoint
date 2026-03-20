/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { verifyAdminLogin } from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  adminPassword: string;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [adminPassword, setAdminPassword] = useState<string>(() => sessionStorage.getItem('adminPassword') || '');
  const isAuthenticated = adminPassword.length > 0;

  const login = async (password: string) => {
    await verifyAdminLogin(password);
    setAdminPassword(password);
    sessionStorage.setItem('adminPassword', password);
  };

  const logout = () => {
    setAdminPassword('');
    sessionStorage.removeItem('adminPassword');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminPassword, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

