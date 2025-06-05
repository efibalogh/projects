import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/shadcn.utils';
import { Bell, CheckCheck, GraduationCap } from 'lucide-react';

import { invitationApi } from '@/api/invitation.api';
import { notificationApi } from '@/api/notification.api';

import { useCourses } from '@/hooks/course';

import type { Notification } from '@/types/notification';

function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCourses } = useCourses();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { count } = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleInvitationResponse = async (enrollmentId: number, action: 'accept' | 'decline') => {
    setIsLoading(true);
    try {
      await invitationApi.respondToInvitation(enrollmentId, action);

      // Update the local notification state
      const status = action === 'accept' ? 'accepted' : 'declined';
      const message =
        action === 'accept' ? 'You have accepted the course invitation' : 'You have declined the course invitation';

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.enrollmentId === enrollmentId
            ? {
                ...notif,
                isRead: true,
                enrollmentStatus: status,
                message,
              }
            : notif,
        ),
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // If invitation was accepted, refresh courses with a small delay
      if (action === 'accept') {
        setTimeout(async () => {
          try {
            await refreshCourses();
            console.log('Courses refreshed after accepting invitation');
          } catch (error) {
            console.error('Failed to refresh courses:', error);
            setTimeout(() => refreshCourses(), 1000);
          }
        }, 500);
      }
    } catch (error) {
      console.error(`Failed to ${action} invitation:`, error);
      await fetchNotifications();
      await fetchUnreadCount();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative p-2 hover:bg-accent transition-colors duration-200">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-auto p-1 text-xs">
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn('flex flex-col items-start p-4 cursor-pointer', !notification.isRead && 'bg-accent/50')}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex w-full items-start gap-3">
                  <GraduationCap className="h-4 w-4 text-blue-500 mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {!notification.isRead && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        Course: {notification.courseName} ({notification.courseCode})
                      </p>
                      <p>From: {notification.teacherName}</p>
                      <p>{formatDate(notification.createdAt)}</p>
                    </div>

                    {/* Course invitation actions */}
                    {notification.enrollmentStatus === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInvitationResponse(notification.enrollmentId, 'accept');
                          }}
                          disabled={isLoading}
                          className="h-7 px-3 text-xs"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInvitationResponse(notification.enrollmentId, 'decline');
                          }}
                          disabled={isLoading}
                          className="h-7 px-3 text-xs"
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationDropdown;
