import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Plus, Save } from 'lucide-react';

type CourseFormData = {
  code: string;
  name: string;
  description: string;
};

type CourseFormProps = {
  title: string;
  description: string;
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  submitLabel: string;
  error?: string | null;
};

function CourseForm({
  title,
  description,
  initialData = { code: '', name: '', description: '' },
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
  error,
}: CourseFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      code: (formData.get('code') as string).toUpperCase(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    });
    console.log(formData.get('code'));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Details
            </CardTitle>
            <CardDescription>Enter the basic information for your course</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={initialData.code}
                  maxLength={6}
                  placeholder="e.g. INF101, MAT201"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">A unique identifier for your course (max 6 characters)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={initialData.name}
                  minLength={3}
                  placeholder="e.g. Introduction to Computer Science"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">The full name of your course (minimum 3 characters)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={initialData.description}
                  placeholder="Describe what students will learn in this course..."
                  required
                  disabled={isLoading}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Provide a detailed description of the course content and objectives
                </p>
              </div>

              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={onCancel} type="button">
                  <ArrowLeft className="h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {submitLabel === 'Create Course' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      {submitLabel === 'Create Course' ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                      {submitLabel}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CourseForm;
