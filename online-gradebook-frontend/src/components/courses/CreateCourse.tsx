import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { courseApi } from '@/api/course.api';

import CourseForm from '@/components/courses/CourseForm';

function CreateCourse() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: { code: string; name: string; description: string }) => {
    setFormError(null);
    setIsLoading(true);

    try {
      await courseApi.createCourse(data);
      console.log('Course created successfully');
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setFormError(errorMessage);
      console.error('Error creating course:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CourseForm
      title="Create New Course"
      description="Set up a new course for your students"
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      isLoading={isLoading}
      submitLabel="Create Course"
      error={formError}
    />
  );
}

export default CreateCourse;
