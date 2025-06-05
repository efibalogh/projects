import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Lock, Mail, Shield, User, UserPlus } from 'lucide-react';

import { useAuth } from '@/hooks/auth';

import AuthForm, { type AuthFormConfig } from '@/components/auth/AuthForm';

const registerConfig: AuthFormConfig = {
  title: 'Join us today',
  description: 'Create your account to start managing courses',
  cardTitle: 'Create Account',
  cardDescription: 'Fill in your details to get started',
  submitButtonText: 'Create Account',
  submitButtonIcon: UserPlus,
  loadingText: 'Creating account...',
  fields: [
    {
      id: 'name',
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      icon: User,
      required: true,
      minLength: 2,
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email',
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
      placeholder: 'Create a password',
      icon: Lock,
      required: true,
      showPasswordToggle: true,
      minLength: 6,
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Confirm your password',
      icon: Shield,
      required: true,
      showPasswordToggle: true,
      minLength: 6,
    },
  ],
  footerText: 'Already have an account?',
  footerLinkText: 'Sign in here',
  footerLinkTo: '/auth/login',
};

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: Record<string, string>) => {
    setError(null);
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    console.log('Attempting registration with:', {
      name: formData.name,
      email: formData.email,
      password: '***',
    });

    try {
      await register(formData.name, formData.email, formData.password, formData.confirmPassword);
      console.log('Registration successful, navigating to login');
      navigate('/auth/login', {
        replace: true,
        state: { message: 'Account created successfully! Please sign in to continue.' },
      });
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return <AuthForm config={registerConfig} onSubmit={handleSubmit} error={error} isLoading={isLoading} />;
}

export default Register;
