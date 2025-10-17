import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import {
  authService,
  type RegisterResponse,
} from '../../services/auth-service';

import type { RegisterFormData } from './types';

// Custom hook to handle the registration
export const useAuthRegister = (
  options?: UseMutationOptions<RegisterResponse, Error, RegisterFormData>
) => {
  return useMutation({
    // The mutationFn is the function that makes the API call.
    // TanStack Query will pass the variables provided to mutate() to this function.
    mutationFn: ({ email, password }: RegisterFormData) =>
      authService.register(email, password),
    ...options,
  });
};
