import { useForm } from 'react-hook-form';

import type { RegisterFormValues, RegisterFormProps } from './types';

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ mode: 'onTouched' });

  const password = watch('password');

  const submit = (data: RegisterFormValues) => {
    const payload = { email: data.email, password: data.password };
    if (onSubmit) {
      onSubmit(payload);
    } else {
      console.log('register', payload);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md w-full">
          <form
            onSubmit={e => {
              void handleSubmit(submit)(e);
            }}
            className="card p-6 shadow-md bg-base-100"
          >
            <h2 className="text-2xl font-bold mb-4">Create account</h2>

            <div className="form-control mb-3 text-left">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: 'Invalid email',
                  },
                })}
                type="email"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <p className="text-sm text-error mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="form-control mb-3 text-left">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                type="password"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                placeholder="••••••••"
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              {errors.password && (
                <p className="text-sm text-error mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="form-control mb-4 text-left">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value =>
                    value === password || 'Passwords do not match',
                })}
                type="password"
                className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="••••••••"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-error mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="form-control mt-4">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
