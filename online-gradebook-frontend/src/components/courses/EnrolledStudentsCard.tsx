import { useCallback, useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, Users } from 'lucide-react';

import { courseApi } from '@/api/course.api';

import type { EnrolledStudent } from '@/types/course';

type EnrolledStudentsCardProps = {
  courseId: number;
  enrollmentCount: number;
  isOwner: boolean;
};

function EnrolledStudentsCard({ courseId, enrollmentCount, isOwner }: EnrolledStudentsCardProps) {
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await courseApi.getCourseStudents(courseId);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (isOwner && enrollmentCount > 0) {
      fetchStudents();
    }
  }, [courseId, isOwner, enrollmentCount, fetchStudents]);

  if (!isOwner) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatEnrollmentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">Enrolled Students</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/20 border-t-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-destructive mb-2">{error}</p>
            <button onClick={fetchStudents} className="text-sm text-primary hover:underline">
              Try again
            </button>
          </div>
        ) : enrollmentCount === 0 ? (
          <div className="text-center py-8">
            <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No students enrolled yet</p>
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-background/50 hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(student.studentName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 justify-between">
                      <p className="font-medium text-sm truncate">{student.studentName}</p>
                      <Badge variant="outline" className="text-xs">
                        {student.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{student.studentEmail}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Enrolled {formatEnrollmentDate(student.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default EnrolledStudentsCard;
