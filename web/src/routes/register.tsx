import {
  RegisterForm,
  type RegisterFormData,
} from '../components/register/RegisterForm';
import { authService } from '../services/auth-service';

export default function Register() {
  const handleSubmit = async ({ email, password }: RegisterFormData) => {
    await authService.register(email, password);
  };
  return <RegisterForm onSubmit={handleSubmit} />;
}
