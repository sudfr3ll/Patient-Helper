// services/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Role = 'attendant' | 'patient' | null;
type AuthState = { isSignedIn: boolean; role: Role; name?: string | null; loading: boolean };
type AuthContextValue = {
  authState: AuthState;
  signIn: (role: Exclude<Role, null>, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};



const KEY = '@patient_helper_auth_v1';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({ isSignedIn: false, role: null, name: null, loading: true });

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { role: Role; name?: string };
          setAuthState({ isSignedIn: !!parsed.role, role: parsed.role ?? null, name: parsed.name ?? null, loading: false });
        } else setAuthState(s => ({ ...s, loading: false }));
      } catch {
        setAuthState(s => ({ ...s, loading: false }));
      }
    })();
  }, []);

  const persist = async (role: Role, name?: string | null) => {
    if (!role) await AsyncStorage.removeItem(KEY);
    else await AsyncStorage.setItem(KEY, JSON.stringify({ role, name }));
  };

  const signIn = async (role: Exclude<Role, null>, name?: string) => {
    setAuthState({ isSignedIn: true, role, name: name ?? null, loading: false });
    await persist(role, name ?? null);
  };

  const signOut = async () => {
    setAuthState({ isSignedIn: false, role: null, name: null, loading: false });
    await persist(null);
  };

  return <AuthContext.Provider value={{ authState, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
