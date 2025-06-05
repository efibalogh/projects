import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/shadcn.utils';

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

function EmptyState({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <Card className={cn('max-w-xlg mx-auto animate-scale-in', className)}>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">{icon}</div>
          <div className="space-y-2">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {actionLabel && onAction && (
            <Button onClick={onAction} className="hover-lift">
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default EmptyState;
