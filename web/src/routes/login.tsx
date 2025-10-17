import { useNavigate } from 'react-router';

import { useAuth } from '../contexts';
import { LoginForm, useAuthLogin, type LoginFormData } from '../features/login';
import { useToastHelpers } from '../features/toast';

export default function LoginPage() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastHelpers();
  const { mutate } = useAuthLogin({
    onSuccess: res => {
      setToken(res.accessToken);
      showSuccess('Login successful.');
      void navigate('/game');
    },
    onError: e => showError(e.message),
  });

  const handleSubmit = ({ email, password }: LoginFormData) => {
    mutate({ email, password });
  };

  return <LoginForm onSubmit={handleSubmit} />;
}
