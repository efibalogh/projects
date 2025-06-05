import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BookOpen } from 'lucide-react';

import { courseApi } from '@/api/course.api';

import type { Course } from '@/types/course';

import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import CourseForm from '@/components/courses/CourseForm';

function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId || isNaN(parseInt(courseId))) {
        setFormError('Invalid course ID');
        setIsLoadingCourse(false);
        return;
      }

      setIsLoadingCourse(true);
      try {
        const data = await courseApi.getCourse(parseInt(courseId, 10));
        setCourse(data);
        setFormError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load course';
        setFormError(errorMessage);
      } finally {
        setIsLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (data: { code: string; name: string; description: string }) => {
    if (!course) return;

    setFormError(null);
    setIsLoading(true);

    try {
      const result = await courseApi.updateCourse(course.id, data);
      console.log('Course updated successfully');
      navigate(`/courses/${result.course.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setFormError(errorMessage);
      console.error('Error updating course:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingCourse) {
    return (
      <LoadingState
        icon={<BookOpen className="h-6 w-6" />}
        title="Loading course..."
        description="Please wait while we fetch the course information"
      />
    );
  }

  if (!course) {
    return (
      <ErrorState
        title="Course not found"
        message="The course you're trying to edit doesn't exist or you don't have permission to edit it."
        actionLabel="Go Back"
        onAction={() => navigate(-1)}
      />
    );
  }

  return (
    <CourseForm
      title="Edit Course"
      description="Update the course information"
      initialData={{
        code: course.code,
        name: course.name,
        description: course.description,
      }}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      isLoading={isLoading}
      submitLabel="Save Changes"
      error={formError}
    />
  );
}

export default EditCourse;
