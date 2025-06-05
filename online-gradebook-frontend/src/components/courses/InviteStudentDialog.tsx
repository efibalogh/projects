import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Mail, UserPlus } from 'lucide-react';

import { invitationApi } from '@/api/invitation.api';

type InviteStudentDialogProps = {
  courseId: number;
  courseName: string;
  trigger?: React.ReactNode;
};

function InviteStudentDialog({ courseId, courseName, trigger }: InviteStudentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await invitationApi.inviteStudent({ email, courseId });
      setSuccess(result.message);
      setEmail('');
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEmail('');
      setError(null);
      setSuccess(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Student
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Invite Student to Course</DialogTitle>
          <DialogDescription>Send an invitation to a student to join "{courseName}"</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Student Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="student@example.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {error && (
            <Alert className="border-destructive/50 text-destructive bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/50 text-green-700 bg-green-50 dark:bg-green-950/20">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              className="flex-1"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading || !email.trim()}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 gap-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteStudentDialog;
