import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { authService, type LoginResponse } from '../../services/auth-service';

import type { LoginFormData } from './types';

// Custom hook to handle the registration
export const useAuthLogin = (
  options?: UseMutationOptions<LoginResponse, Error, LoginFormData>
) => {
  return useMutation({
    // The mutationFn is the function that makes the API call.
    // TanStack Query will pass the variables provided to mutate() to this function.
    mutationFn: ({ email, password }: LoginFormData) =>
      authService.login(email, password),
    ...options,
  });
};
