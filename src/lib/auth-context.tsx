'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {api} from '@/lib/api';

const TOKEN_KEY = 'access_token';
const USER_KEY  = 'auth_user';

export const tokenCookies = {
  get:    () => Cookies.get(TOKEN_KEY),
  set:    (t: string) => Cookies.set(TOKEN_KEY, t, { expires: 7, sameSite: 'strict' }),
  remove: () => Cookies.remove(TOKEN_KEY),
};
export const userCookies = {
  get:    () => { try { const r = Cookies.get(USER_KEY); return r ? JSON.parse(r) : null; } catch { return null; } },
  set:    (u: any) => Cookies.set(USER_KEY, JSON.stringify(u), { expires: 7, sameSite: 'strict' }),
  remove: () => Cookies.remove(USER_KEY),
};
export const clearAuth = () => { tokenCookies.remove(); userCookies.remove(); };

interface AuthUser {
  _id: string; id: string; email: string; fullName: string;
  role: 'user' | 'admin'; balance: number; totalInvested: number;
  totalProfit: number; phone?: string; profilePhoto?: string;
  isEmailVerified: boolean; isActive: boolean; isAdmin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (data: { fullName: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: (u: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const saved = userCookies.get();
    const token = tokenCookies.get();
    if (saved && token) setUser(saved);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken, user: u } = res.data;
    if (accessToken) tokenCookies.set(accessToken);
    userCookies.set(u);
    setUser(u);
    router.push('/overview');
  };

  const adminLogin = async (email: string, password: string) => {
    const res = await api.post('/admin/auth/login', { email, password });
    const { accessToken, user: u } = res.data;
    if (accessToken) tokenCookies.set(accessToken);
    userCookies.set(u);
    setUser(u);
    router.push('/admin/dashboard');
  };

  const register = async (data: { fullName: string; email: string; password: string; phone?: string }) => {
    const res = await api.post('/auth/register', data);
    const { accessToken, user: u } = res.data;
    if (accessToken) tokenCookies.set(accessToken);
    if (u) { userCookies.set(u); setUser(u); router.push('/overview'); }
    else router.push('/login');
  };

  const logout = () => { clearAuth(); setUser(null); router.push('/login'); };
  const refreshUser = (u: AuthUser) => { userCookies.set(u); setUser(u); };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, adminLogin, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};