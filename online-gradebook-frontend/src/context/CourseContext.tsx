import { createContext, useCallback, useState } from 'react';

import { courseApi } from '@/api/course.api';

import type { Course } from '@/types/course';

type CourseContextType = {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  refreshCourses: () => Promise<void>;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
};

type CourseProviderProps = {
  children: React.ReactNode;
};

export function CourseProvider({ children }: CourseProviderProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await courseApi.getAllCourses();
      setCourses(data);
      setError(null);
      console.log('Courses fetched:', data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Failed to fetch courses:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCourses = useCallback(async () => {
    try {
      const data = await courseApi.getAllCourses();
      setCourses(data);
      setError(null);
      console.log('Courses refreshed:', data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Failed to refresh courses:', errorMessage);
    }
  }, []);

  const value = {
    courses,
    isLoading,
    error,
    fetchCourses,
    refreshCourses,
    setCourses,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);
export default CourseContext;
