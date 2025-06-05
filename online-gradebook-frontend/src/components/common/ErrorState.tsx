import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/shadcn.utils';

type ErrorStateProps = {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

function ErrorState({ title = 'Error', message, actionLabel = 'Try Again', onAction, className }: ErrorStateProps) {
  return (
    <div className={cn('container mx-auto p-6', className)}>
      <Card className="max-w-md mx-auto status-error animate-scale-in">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm opacity-90">{message}</p>
            </div>
            {onAction && (
              <Button onClick={onAction} variant="outline" className="hover-lift">
                {actionLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ErrorState;
