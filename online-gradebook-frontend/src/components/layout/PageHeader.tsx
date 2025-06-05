import { Button } from '@/components/ui/button';
import { cn } from '@/lib/shadcn.utils';

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
};

export default function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in', className)}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {title}
        </h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button asChild={!!action.href} onClick={action.onClick} className="gap-2 hover-lift shadow-lg">
          {action.href ? (
            <a href={action.href}>
              {action.icon}
              {action.label}
            </a>
          ) : (
            <>
              {action.icon}
              {action.label}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
