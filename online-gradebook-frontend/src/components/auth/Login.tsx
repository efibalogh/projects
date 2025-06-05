import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Lock, LogIn, Mail } from 'lucide-react';

import { useAuth } from '@/hooks/auth';

import AuthForm, { type AuthFormConfig } from '@/components/auth/AuthForm';

const loginConfig: AuthFormConfig = {
  title: 'Welcome back',
  description: 'Sign in to your account to continue',
  cardTitle: 'Sign In',
  cardDescription: 'Enter your credentials to access your dashboard',
  submitButtonText: 'Sign In',
  submitButtonIcon: LogIn,
  loadingText: 'Signing in...',
  fields: [
    {
      id: 'email',
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter your email',
      icon: Mail,
      required: true,
    },
    {
      id: 'password',
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      icon: Lock,
      required: true,
      showPasswordToggle: true,
    },
  ],
  footerText: "Don't have an account?",
  footerLinkText: 'Create one here',
  footerLinkTo: '/auth/register',
};

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: Record<string, string>) => {
    setError(null);
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthForm config={loginConfig} onSubmit={handleSubmit} error={error} isLoading={isLoading} />;
}

export default Login;
