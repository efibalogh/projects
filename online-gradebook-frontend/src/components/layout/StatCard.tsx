import { Card } from '@/components/ui/card';
import { cn } from '@/lib/shadcn.utils';

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number;
  borderColor: string;
  iconColor: string;
  className?: string;
};

export default function StatCard({ icon, title, value, borderColor, iconColor, className }: StatCardProps) {
  return (
    <Card className={cn(`p-4 border-l-4 ${borderColor}`, className)}>
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 ${iconColor}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </Card>
  );
}
