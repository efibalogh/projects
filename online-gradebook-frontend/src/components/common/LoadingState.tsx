import { cn } from '@/lib/shadcn.utils';

type LoadingStateProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
};

function LoadingState({ icon, title = 'Loading...', description = 'Please wait', className }: LoadingStateProps) {
  return (
    <div className={cn('flex items-center justify-center min-h-[60vh]', className)}>
      <div className="text-center space-y-4 animate-scale-in">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
          {icon && (
            <div className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary">
              {icon}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;
