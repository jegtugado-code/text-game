import { useMutation } from '@tanstack/react-query';

import { authService } from '../services/auth-service';

interface AuthRegisterVariables {
  email: string;
  password: string;
}

// Custom hook to handle the registration
export const useAuthRegister = () => {
  return useMutation({
    // The mutationFn is the function that makes the API call.
    // TanStack Query will pass the variables provided to mutate() to this function.
    mutationFn: ({ email, password }: AuthRegisterVariables) =>
      authService.register(email, password),
  });
};
