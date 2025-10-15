export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
}

export interface RegisterFormProps {
  onSubmit?: (values: RegisterFormData) => void;
}

export interface AuthRegisterVariables {
  email: string;
  password: string;
}
