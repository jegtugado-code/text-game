import { useNavigate } from 'react-router';

import {
  RegisterForm,
  useAuthRegister,
  type RegisterFormData,
} from '../features/register';
import { useToastHelpers } from '../features/toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastHelpers();
  const { mutate } = useAuthRegister({
    onSuccess: _ => {
      showSuccess('Account registered.');
      void navigate('/login');
    },
    onError: e => showError(e.message),
  });

  const handleSubmit = ({ email, password }: RegisterFormData) => {
    mutate({ email, password });
  };

  return <RegisterForm onSubmit={handleSubmit} />;
}
