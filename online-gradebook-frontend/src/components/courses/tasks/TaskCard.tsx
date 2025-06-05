import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/shadcn.utils';
import { AlertTriangle, Calendar, Clock, Edit3, Eye } from 'lucide-react';

import type { Task } from '@/types/task';

import DeleteDialog from '@/components/common/DeleteDialog';

type TaskCardProps = {
  task: Task;
  isOwner: boolean;
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => void;
};

function TaskCard({ task, isOwner, onEdit, onDelete }: TaskCardProps) {
  const formatDeadline = (deadline: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Date(deadline).toLocaleString('en-GB', options);
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

  return (
    <Card
      className={cn(
        'border-l-4 transition-all duration-200 hover-lift',
        isDeadlinePassed(task.deadline)
          ? 'border-l-destructive bg-destructive/5'
          : isDeadlineSoon(task.deadline)
          ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
          : 'border-l-primary bg-primary/5',
      )}
    >
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <h4 className="font-semibold text-lg">{task.name}</h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDeadline(task.deadline)}
              </div>
              {isDeadlinePassed(task.deadline) && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
              {isDeadlineSoon(task.deadline) && !isDeadlinePassed(task.deadline) && (
                <Badge className="text-xs bg-amber-300 text-amber-800 border-amber-300">
                  <Clock className="h-3 w-3 mr-1" />
                  Due Soon
                </Badge>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2 hover-lift">
              <a href={`http://localhost:3000/uploads/${task.filePath}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-3 w-3" />
              </a>
            </Button>
            {isOwner && (
              <>
                <Button variant="outline" size="sm" onClick={() => onEdit(task.id)} className="gap-2 hover-lift">
                  <Edit3 className="h-3 w-3" />
                </Button>
                <DeleteDialog
                  title="Delete Task"
                  description={`Are you sure you want to delete "${task.name}"? This action cannot be undone.`}
                  onDelete={() => onDelete(task.id)}
                  triggerVariant="icon"
                />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskCard;
