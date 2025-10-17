export interface AuthContextType {
  isAuthenticated: boolean;
  claims: JwtClaims | null;
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export interface JwtClaims {
  sub: string;
  email?: string;
  role?: string;
  exp?: number;
  [key: string]: unknown; // Allow custom claims
}
