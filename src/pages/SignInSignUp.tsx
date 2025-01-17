import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuthStore } from '../store/useStore';

interface FormValues {
  email: string;
  password: string;
  confirmPassword?: string; // only used in sign-up
}

const SignInSignUp: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  // We can watch the password for matching in sign-up
  const watchPassword = watch('password', '');

  // Our onSubmit handler
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // Basic placeholder logic:
    // 1) If isSignIn: simulate "login"
    // 2) If !isSignIn: simulate "registration" & check for matching password
    if (!isSignIn && data.password !== data.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // If sign-in/sign-up is successful, store user in Zustand
    setUser({ email: data.email });

    // Navigate to home page
    navigate('/Home');
  };

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 mx-auto">
        <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-center">
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </h2>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Email"
                // Register with validation rules
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 4,
                    message: 'Password must be at least 4 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password (only for sign-up) */}
            {!isSignIn && (
              <div>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Confirm Password"
                  {...register('confirmPassword', {
                    required: 'Confirm Password is required',
                    validate: (value) =>
                      value === watchPassword || 'Passwords do not match',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="text-center">
            <p>
              {isSignIn ? 'Don’t have an account?' : 'Already have an account?'}
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="text-blue-600 hover:underline ml-1"
              >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
