import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateTimePicker24h } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, CircleAlert, Edit3, Plus, Save, X } from 'lucide-react';

type TaskFormData = {
  name: string;
  deadline: Date;
  file: File | null;
};

type TaskFormProps = {
  mode: 'create' | 'edit';
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  error?: string | null;
};

function TaskForm({ mode, initialData = {}, onSubmit, onCancel, isLoading, error }: TaskFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialData.deadline);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDate) {
      setFormError('Deadline is required');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;

    onSubmit({
      name: formData.get('name') as string,
      deadline: selectedDate,
      file: fileInput.files?.[0] || null,
    });
  };

  const isCreate = mode === 'create';

  return (
    <Card className={'mb-6 border-dashed border-2 border-primary/20 bg-primary/5'}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {isCreate ? <Plus className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {isCreate ? 'Create New Task' : 'Edit Task'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {isCreate ? 'Add a new assignment for your students' : 'Update the task information'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              name="name"
              defaultValue={initialData.name || ''}
              placeholder="Enter task name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-deadline">Deadline</Label>
            <DateTimePicker24h value={selectedDate} onChange={setSelectedDate} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-file">
              Task Description (PDF)
              {!isCreate && ' - Optional'}
            </Label>
            <Input type="file" id="task-file" name="file" accept=".pdf" required={isCreate} disabled={isLoading} />
            <p className="text-xs text-muted-foreground">
              {isCreate
                ? 'Upload a PDF file with task requirements'
                : 'Leave empty to keep current file, or upload a new PDF to replace it'}
            </p>
          </div>

          {(error || formError) && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              <div className="flex items-center gap-2">
                <CircleAlert className="h-4 w-4" />
                {error || formError}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {!isCreate && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {isCreate ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  {isCreate ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {isCreate ? 'Create Task' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default TaskForm;
