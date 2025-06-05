import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/shadcn.utils';
import { BookOpen, Clock, Crown, Eye, GraduationCap } from 'lucide-react';

import type { Course } from '@/types/course';

import DeleteDialog from '@/components/common/DeleteDialog';

type CourseCardProps = {
  course: Course;
  index: number;
  onDelete: (courseId: number) => void;
};

function CourseCard({ course, index, onDelete }: CourseCardProps) {
  const getTaskStatusColor = (taskCount: number) => {
    if (taskCount === 0) return 'text-muted-foreground';
    if (taskCount <= 3) return 'text-yellow-600';
    if (taskCount <= 6) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        'hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1',
        'border-0 bg-gradient-to-br from-card to-card/50',
        'animate-fade-in',
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <Badge variant="secondary" className="text-xs font-medium">
                {course.code}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-200">
              {course.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{course.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Clock className={cn('h-3 w-3', getTaskStatusColor(course.tasks?.length || 0))} />
              <span className={getTaskStatusColor(course.tasks?.length || 0)}>
                {course.tasks?.length || 0} task{(course.tasks?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            {course.isOwner && typeof course.enrollmentCount === 'number' && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <GraduationCap className="h-3 w-3" />
                <span>
                  {course.enrollmentCount} student{course.enrollmentCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {course.courseOwner && !course.isOwner && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Crown className="h-3 w-3" />
                <span className="truncate max-w-50">{course.courseOwner.name}</span>
              </div>
            )}
          </div>

          {course.isOwner && (
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              Owner
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="relative pt-0 mt-auto">
        <div className="flex gap-2 w-full">
          <Button asChild variant="outline" size="sm" className="flex-1 hover-lift transition-all duration-200">
            <Link to={`/courses/${course.id}`}>
              <Eye className="h-3 w-3" />
              View
            </Link>
          </Button>

          {course.isOwner && (
            <DeleteDialog
              title="Delete Course"
              description={`Are you sure you want to delete "${course.name} (${course.code})"? This action cannot be undone and will remove all associated tasks.`}
              onDelete={() => onDelete(course.id)}
              triggerVariant="icon"
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
