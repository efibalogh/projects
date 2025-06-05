import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, BookOpen, Crown, Edit3, FileText, Plus, UserPlus } from 'lucide-react';

import { courseApi } from '@/api/course.api';

import type { Course } from '@/types/course';
import type { Task, TaskRequest } from '@/types/task';

import DeleteDialog from '@/components/common/DeleteDialog';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import EnrolledStudentsCard from '@/components/courses/EnrolledStudentsCard';
import InviteStudentDialog from '@/components/courses/InviteStudentDialog';
import TaskCard from '@/components/courses/tasks/TaskCard';
import TaskForm from '@/components/courses/tasks/TaskForm';

function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Task management state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [createTaskError, setCreateTaskError] = useState<string | null>(null);
  const [editTaskError, setEditTaskError] = useState<string | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId || isNaN(parseInt(courseId))) {
        setError('Invalid course ID');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await courseApi.getCourse(parseInt(courseId, 10));
        setCourse(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleDeleteTask = async (taskId: number) => {
    if (!course) return;

    try {
      await courseApi.deleteTask(course.id, taskId);
      setCourse((prevCourse) => {
        if (!prevCourse) return null;
        return {
          ...prevCourse,
          tasks: prevCourse.tasks.filter((task) => task.id !== taskId),
        };
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    }
  };

  const handleDeleteCourse = async () => {
    if (!course) return;

    try {
      await courseApi.deleteCourse(course.id);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    }
  };

  const handleCreateTask = async (data: { name: string; deadline: Date; file: File | null }) => {
    if (!data.file || !course) {
      setCreateTaskError('Task file is required.');
      return;
    }

    if (!data.deadline || isNaN(data.deadline.getTime())) {
      setCreateTaskError('Valid deadline is required.');
      return;
    }

    setIsCreatingTask(true);
    setCreateTaskError(null);

    try {
      const result = await courseApi.createTask(course.id, {
        name: data.name,
        deadline: data.deadline.toISOString(),
        file: data.file,
      });

      setCourse((prevCourse) => {
        if (!prevCourse) return null;
        return {
          ...prevCourse,
          tasks: [...prevCourse.tasks, result.task],
        };
      });

      setCreateTaskError(null);
      setShowCreateForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setCreateTaskError(errorMessage);
      console.error('Task creation error:', err);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleEditTask = (taskId: number) => {
    const task = course?.tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setEditTaskError(null);
    }
  };

  const handleUpdateTask = async (data: { name: string; deadline: Date; file: File | null }) => {
    if (!editingTask || !course) return;

    setIsEditingTask(true);
    setEditTaskError(null);

    try {
      const updateData: Partial<TaskRequest> = {
        name: data.name,
        deadline: data.deadline.toISOString(),
      };

      if (data.file) {
        updateData.file = data.file;
      }

      const result = await courseApi.updateTask(course.id, editingTask.id, updateData);

      setCourse((prevCourse) => {
        if (!prevCourse) return null;
        return {
          ...prevCourse,
          tasks: prevCourse.tasks.map((task) => (task.id === editingTask.id ? result.task : task)),
        };
      });

      setEditingTask(null);
      setEditTaskError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setEditTaskError(errorMessage);
      console.error('Task update error:', err);
    } finally {
      setIsEditingTask(false);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTaskError(null);
  };

  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (error && !course) {
    return (
      <ErrorState
        title="Error loading course"
        message={error}
        actionLabel="Back to Courses"
        onAction={() => navigate('/')}
      />
    );
  }

  if (isLoading) {
    return (
      <LoadingState
        icon={<BookOpen className="h-6 w-6" />}
        title="Loading course details..."
        description="Please wait while we fetch the course information"
      />
    );
  }

  if (!course) return null;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fade-in">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gradient-hero">{course.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="secondary" className="font-medium">
              {course.code}
            </Badge>
            {course.courseOwner && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Crown className="h-3 w-3" />
                {course.courseOwner.name}
              </div>
            )}
            {course.isOwner && <Badge className="bg-primary/10 text-primary border-primary/30">Owner</Badge>}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <Alert className="status-error">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Information */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{course.description}</p>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card className="card-modern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Tasks
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Create Task Form */}
              {showCreateForm && course.isOwner && (
                <TaskForm
                  mode="create"
                  onSubmit={handleCreateTask}
                  onCancel={() => setShowCreateForm(false)}
                  isLoading={isCreatingTask}
                  error={createTaskError}
                />
              )}

              {/* Edit Task Form */}
              {editingTask && (
                <TaskForm
                  mode="edit"
                  initialData={{
                    name: editingTask.name,
                    deadline: new Date(editingTask.deadline),
                  }}
                  onSubmit={handleUpdateTask}
                  onCancel={cancelEdit}
                  isLoading={isEditingTask}
                  error={editTaskError}
                />
              )}

              {/* Tasks List */}
              {course.tasks && course.tasks.length > 0 ? (
                <div className="space-y-4">
                  {course.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isOwner={course.isOwner || false}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              ) : !showCreateForm ? (
                <EmptyState
                  icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                  title="No tasks available"
                  description={
                    course.isOwner ? 'Create your first task to get started' : 'No tasks have been assigned yet'
                  }
                />
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <Badge variant="secondary">{course.tasks?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overdue</span>
                <Badge variant="destructive">
                  {course.tasks?.filter((task) => isDeadlinePassed(task.deadline)).length || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due Soon</span>
                <Badge className="bg-amber-300 text-amber-800 border-amber-300">
                  {course.tasks?.filter((task) => isDeadlineSoon(task.deadline)).length || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <EnrolledStudentsCard
            courseId={course.id}
            enrollmentCount={course.enrollmentCount || 0}
            isOwner={course.isOwner || false}
          />

          {/* Actions */}
          {course.isOwner && (
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-lg">Course Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 hover-lift"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  <Plus className="h-4 w-4" />
                  Add New Task
                </Button>

                <InviteStudentDialog
                  courseId={course.id}
                  courseName={course.name}
                  trigger={
                    <Button variant="outline" className="w-full justify-start gap-2 hover-lift">
                      <UserPlus className="h-4 w-4" />
                      Invite Student
                    </Button>
                  }
                />

                <Button asChild variant="outline" className="w-full justify-start gap-2 hover-lift">
                  <Link to={`/courses/${course.id}/edit`}>
                    <Edit3 className="h-4 w-4" />
                    Edit Course
                  </Link>
                </Button>

                <DeleteDialog
                  title="Delete Course"
                  description={`Are you sure you want to delete "${course.name} (${course.code})"? This action cannot be undone and will remove all associated tasks.`}
                  onDelete={handleDeleteCourse}
                  triggerVariant="full"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
