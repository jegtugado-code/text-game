import { useNavigate } from 'react-router';

import { LoginForm, useAuthLogin, type LoginFormData } from '../features/login';
import { useToastHelpers } from '../features/toast';

export default function Login() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastHelpers();
  const { mutate } = useAuthLogin({
    onSuccess: _ => {
      showSuccess('Login successful.');
      void navigate('/');
    },
    onError: e => showError(e.message),
  });

  const handleSubmit = ({ email, password }: LoginFormData) => {
    mutate({ email, password });
  };

  return <LoginForm onSubmit={handleSubmit} />;
}
