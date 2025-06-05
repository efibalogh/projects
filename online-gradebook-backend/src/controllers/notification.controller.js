import { notificationModel } from '../models/notification.model.js';

export const getUserNotifications = async (req, res) => {
  console.log('GET /api/notifications');

  try {
    const notifications = await notificationModel.getByUserId(req.user.id);
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const getUnreadCount = async (req, res) => {
  console.log('GET /api/notifications/unread-count');

  try {
    const count = await notificationModel.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

export const markAsRead = async (req, res) => {
  console.log(`PUT /api/notifications/${req.params.id}`);

  try {
    const { id } = req.params;
    const success = await notificationModel.markAsRead(id, req.user.id);

    if (!success) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    return res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  console.log('PUT /api/notifications/mark-all-as-read');

  try {
    const count = await notificationModel.markAllAsRead(req.user.id);
    return res.json({ message: `Marked ${count} notifications as read` });
  } catch (error) {
    console.error('Mark all as read error:', error);
    return res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};
