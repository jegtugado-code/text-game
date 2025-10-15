import { useEffect } from 'react';

import {
  RegisterForm,
  useAuthRegister,
  type RegisterFormData,
} from '../features/register';
import { useToastHelpers } from '../features/toast';

export default function Register() {
  const { mutate, isError, error } = useAuthRegister();
  const { showError } = useToastHelpers();

  const handleSubmit = ({ email, password }: RegisterFormData) => {
    mutate({ email, password });
  };

  useEffect(() => {
    if (!isError || !error) return;

    showError(error.message);
  }, [isError, error, showError]);

  return <RegisterForm onSubmit={handleSubmit} />;
}
