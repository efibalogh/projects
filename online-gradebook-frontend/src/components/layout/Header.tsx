import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { cn } from '@/lib/shadcn.utils';
import { GraduationCap, LogOut, Settings, User } from 'lucide-react';

import { useAuth } from '@/hooks/auth';

import NotificationDropdown from '@/components/common/NotificationDropdown';

function Header({ title }: { title: string }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        'bg-background/70 backdrop-blur-sm border-b',
        isScrolled ? 'shadow-lg border-border/40' : 'border-border/20',
      )}
    >
      <div className="flex h-16 items-center justify-between pl-6 pr-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
            <div className="relative flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary relative z-10 transition-transform duration-200 group-hover:scale-110" />
            </div>
          </div>
          <div className="flex items-center space-y-0">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-gradient">{title}</h1>
          </div>
        </div>

        {/* Right side - Auth section */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          {isAuthenticated && user ? (
            <>
              {/* Notifications */}
              <NotificationDropdown />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 h-auto',
                      'hover:bg-accent/50 transition-all duration-200',
                      'border border-transparent hover:border-border/50 rounded-lg',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-32">{user.email}</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-destructive" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
