import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, GraduationCap, type LucideIcon } from 'lucide-react';

import { useAuth } from '@/hooks/auth';

export type AuthFieldType = 'text' | 'email' | 'password';

export type AuthField = {
  id: string;
  name: string;
  label: string;
  type: AuthFieldType;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  showPasswordToggle?: boolean;
  minLength?: number;
};

export type AuthFormConfig = {
  title: string;
  description: string;
  cardTitle: string;
  cardDescription: string;
  submitButtonText: string;
  submitButtonIcon: LucideIcon;
  loadingText: string;
  fields: AuthField[];
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
};

export type AuthFormProps = {
  config: AuthFormConfig;
  onSubmit: (formData: Record<string, string>) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
};

function AuthForm({ config, onSubmit, error, isLoading = false }: AuthFormProps) {
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    config.fields.forEach((field) => {
      initialData[field.id] = '';
    });
    return initialData;
  });

  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const togglePasswordVisibility = (fieldId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  const renderField = (field: AuthField) => {
    const isPassword = field.type === 'password';
    const isPasswordVisible = passwordVisibility[field.id];
    const fieldType = isPassword ? (isPasswordVisible ? 'text' : 'password') : field.type;

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.id} className="flex items-center gap-2 text-sm font-medium">
          {field.label}
        </Label>
        <div className="relative">
          <Input
            id={field.id}
            name={field.name}
            type={fieldType}
            value={formData[field.id]}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required !== false}
            minLength={field.minLength}
            disabled={isLoading}
            className={`pl-10 ${isPassword && field.showPasswordToggle ? 'pr-10' : ''} h-11`}
          />
          <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          {isPassword && field.showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
              onClick={() => togglePasswordVisibility(field.id)}
              disabled={isLoading}
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{isPasswordVisible ? 'Hide password' : 'Show password'}</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-xl space-y-8 animate-scale-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center relative">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-glow-pulse"></div>
              <GraduationCap className="relative h-16 w-16 text-primary animate-float" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gradient-hero">{config.title}</h1>
            <p className="text-muted-foreground text-lg">{config.description}</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="card-modern">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center">{config.cardTitle}</CardTitle>
            <CardDescription className="text-center">{config.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Dynamic Fields */}
              {config.fields.map(renderField)}

              {/* Error Message */}
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg border border-destructive/20 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="btn-gradient w-full h-12 text-base font-semibold" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>{config.loadingText}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <config.submitButtonIcon className="h-5 w-5" />
                    <span>{config.submitButtonText}</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground">
                {config.footerText}{' '}
                <Link
                  to={config.footerLinkTo}
                  className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors duration-200"
                >
                  {config.footerLinkText}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AuthForm;
