import { useEffect } from 'react';

import {
  RegisterForm,
  type RegisterFormData,
} from '../components/register/RegisterForm';
import { useAuthRegister } from '../hooks/use-auth-register';
import { useToastHelpers } from '../hooks/use-toast-helpers';

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
