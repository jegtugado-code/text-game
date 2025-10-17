import { apiClient } from './api-client';

export const authService = {
  register: async (email: string, password: string) => {
    const response = await apiClient.post<RegisterResponse>(
      '/api/auth/register',
      JSON.stringify({
        email,
        password,
      })
    );
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await apiClient.post<LoginResponse>(
      '/api/auth/login',
      JSON.stringify({
        email,
        password,
      })
    );
    return response.data;
  },
};

export interface RegisterResponse {
  message: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
}
