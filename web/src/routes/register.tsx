import {
  RegisterForm,
  type RegisterFormData,
} from '../components/register/RegisterForm';
import { authService } from '../services/auth-service';

export default function Register() {
  const handleSubmit = ({ email, password }: RegisterFormData) => {
    authService.register(email, password).catch(e => console.error(e));
  };
  return <RegisterForm onSubmit={handleSubmit} />;
}
