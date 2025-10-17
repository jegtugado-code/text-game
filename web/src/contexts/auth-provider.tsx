import { jwtDecode } from 'jwt-decode';
import { type ReactNode, useState } from 'react';

import { AuthContext } from './auth-context';
import type { JwtClaims } from './types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [claims, setClaims] = useState<JwtClaims | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);

  const setToken = (value: string | null) => {
    setJwt(value);
    if (!value) {
      setClaims(null);
      return;
    }
    try {
      const decoded = jwtDecode<JwtClaims>(value);
      setClaims(decoded);
    } catch (err) {
      console.error('Invalid JWT', err);
      setClaims(null);
    }
  };
  const clearToken = () => setToken(null);
  const isAuthenticated = !!claims;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token: jwt, claims, setToken, clearToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
