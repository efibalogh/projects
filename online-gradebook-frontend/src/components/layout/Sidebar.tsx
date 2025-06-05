import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/shadcn.utils';
import { BookOpen, Plus, Users } from 'lucide-react';

import { useAuth } from '@/hooks/auth';

// Navigation items with role requirements
const allNavigation = [
  {
    name: 'Course List',
    href: '/',
    icon: BookOpen,
    roles: ['student', 'teacher'],
  },
  {
    name: 'Create Course',
    href: '/create-course',
    icon: Plus,
    roles: ['teacher'],
  },
  {
    name: 'Manage Users',
    href: '/users',
    icon: Users,
    roles: ['teacher'],
  },
];

function Sidebar() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  // Filter navigation based on user role
  const navigation = allNavigation
    .filter((item) => item.roles.includes(user?.role || 'student'))
    .map((item) => ({
      ...item,
      current: location.pathname === item.href,
    }));

  return (
    <aside className="w-64 border-r border-border/40 glass-effect p-4">
      <div className="space-y-2">
        <nav className="space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <Button
                  asChild
                  variant={item.current ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-11 hover-lift transition-all duration-200',
                    item.current
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover-glow'
                      : 'hover:bg-accent/50 hover:text-accent-foreground',
                  )}
                >
                  <Link to={item.href} className="flex items-center gap-3 w-full">
                    <Icon className={cn('h-4 w-4 transition-transform duration-200', item.current && 'scale-110')} />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </Link>
                </Button>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
