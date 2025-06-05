import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

type DeleteDialogProps = {
  title: string;
  description: string;
  onDelete: () => void;
  triggerVariant?: 'full' | 'medium' | 'icon';
  animate?: boolean;
};

function DeleteDialog({ title, description, onDelete, triggerVariant = 'full', animate = false }: DeleteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerVariant === 'full' ? (
          <Button variant="destructive" className="w-full justify-start gap-2 hover-lift">
            <Trash2 className="h-4 w-4" />
            {title}
          </Button>
        ) : triggerVariant === 'medium' ? (
          <Button variant="destructive" className="w-fit justify-start gap-2 hover-lift">
            <Trash2 className="h-4 w-4" />
            {title}
          </Button>
        ) : (
          <Button variant="destructive" size="sm" className="hover-lift transition-all duration-200">
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={animate ? 'animate-scale-in' : ''}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
