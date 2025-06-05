import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/shadcn.utils';
import { AlertTriangle, BookOpen, FileText, Filter, Search } from 'lucide-react';

import { useAuth } from '@/hooks/auth';
import { useCourses } from '@/hooks/course';

import { courseApi } from '@/api/course.api';

import type { Course } from '@/types/course';

import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import CourseCard from '@/components/courses/CourseCard';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/layout/StatCard';

function CourseList() {
  const { courses, isLoading, error, fetchCourses, setCourses } = useCourses();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'Name' | 'Tasks' | 'Recent'>('Tasks');
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Sort courses
    switch (sortBy) {
      case 'Name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Tasks':
        filtered.sort((a, b) => (b.tasks?.length || 0) - (a.tasks?.length || 0));
        break;
      case 'Recent':
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, sortBy]);

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await courseApi.deleteCourse(courseId);
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        icon={<BookOpen className="h-6 w-6" />}
        title="Loading courses..."
        description="Please wait while we fetch your courses"
      />
    );
  }

  if (error && courses.length === 0) {
    return (
      <ErrorState
        title="Error loading courses"
        message={error}
        actionLabel="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <PageHeader title="My Courses" description="Manage your courses and track assignments" />

        {/* Search, Filter Bar and Stats */}
        {courses.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4" style={{ animationDelay: '100ms' }}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses by name, code, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 min-w-[140px] h-11">
                    <Filter className="h-4 w-4" />
                    Sort by {sortBy}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy('Name')}>Sort by Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('Tasks')}>Sort by Tasks</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('Recent')}>Sort by Recent</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div
              className={cn(
                'grid grid-cols-1 gap-4 animate-fade-in',
                user?.role === 'teacher' ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
              )}
              style={{ animationDelay: '200ms' }}
            >
              <StatCard
                icon={<BookOpen className="h-8 w-8" />}
                title="Total Courses"
                value={courses.length}
                borderColor="border-l-primary"
                iconColor="text-primary"
              />
              {user?.role === 'teacher' ? (
                <StatCard
                  icon={<BookOpen className="h-8 w-8" />}
                  title="My Courses"
                  value={courses.filter((course) => course.isOwner).length}
                  borderColor="border-l-green-500"
                  iconColor="text-green-500"
                />
              ) : null}
              <StatCard
                icon={<FileText className="h-8 w-8" />}
                title="Total Tasks"
                value={courses.reduce((acc, course) => acc + (course.tasks?.length || 0), 0)}
                borderColor="border-l-blue-500"
                iconColor="text-blue-500"
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {/* Error Banner */}
      {error && courses.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            Last attempt to fetch updates failed: {error}. Displaying cached data.
          </AlertDescription>
        </Alert>
      )}

      {/* Courses Grid */}
      {filteredCourses.length === 0 && !isLoading && !error ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8 text-muted-foreground" />}
          title={searchQuery ? 'No courses found' : 'No courses yet'}
          description={
            searchQuery
              ? 'Try adjusting your search criteria'
              : user?.role === 'teacher'
              ? 'Get started by creating your first course'
              : 'Get started by enrolling in your first course'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} onDelete={handleDeleteCourse} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
