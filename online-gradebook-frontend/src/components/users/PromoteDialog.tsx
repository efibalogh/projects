import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertTriangle, Crown } from 'lucide-react';

type PromoteDialogProps = {
  userName: string;
  onPromote: () => void;
  isLoading?: boolean;
};

function PromoteDialog({ userName, onPromote, isLoading = false }: PromoteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading} className="hover-lift transition-all duration-200">
          <Crown className="h-4 w-4" />
          Promote to Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Promote User to Teacher</DialogTitle>
          <DialogDescription>
            Are you sure you want to promote <strong>{userName}</strong> to Teacher role? This will allow them to:
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Create and manage courses</li>
              <li>• Invite students to courses</li>
              <li>• Create and edit tasks</li>
              <li>• Access user management</li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> Promoting this user to Teacher will automatically remove them from all courses
            they are currently enrolled in as a student.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onPromote} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Promoting...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4" />
                Promote to Teacher
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PromoteDialog;
