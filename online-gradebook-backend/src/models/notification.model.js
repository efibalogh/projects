import db from '../config/db.config.js';

export class Notification {
  async create({ userId, title, message, enrollmentId }) {
    const [result] = await db.pool.query(
      `INSERT INTO notifications (userId, title, message, enrollmentId) 
       VALUES (?, ?, ?, ?)`,
      [userId, title, message, enrollmentId],
    );
    return this.get(result.insertId);
  }

  async get(id) {
    const [rows] = await db.pool.query(
      `SELECT n.*, ce.courseId, ce.status as enrollmentStatus,
              c.name as courseName, c.code as courseCode,
              u.name as teacherName
       FROM notifications n
       JOIN course_enrollments ce ON n.enrollmentId = ce.id
       JOIN courses c ON ce.courseId = c.id
       JOIN users u ON ce.invitedBy = u.id
       WHERE n.id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  async getByUserId(userId) {
    const [rows] = await db.pool.query(
      `SELECT n.*, ce.courseId, ce.status as enrollmentStatus,
              c.name as courseName, c.code as courseCode,
              u.name as teacherName
       FROM notifications n
       JOIN course_enrollments ce ON n.enrollmentId = ce.id
       JOIN courses c ON ce.courseId = c.id
       JOIN users u ON ce.invitedBy = u.id
       WHERE n.userId = ? 
       ORDER BY n.createdAt DESC`,
      [userId],
    );
    return rows;
  }

  async markAsRead(id, userId) {
    const [result] = await db.pool.query(
      `UPDATE notifications 
       SET isRead = TRUE 
       WHERE id = ? AND userId = ?`,
      [id, userId],
    );
    return result.affectedRows > 0;
  }

  async markAllAsRead(userId) {
    const [result] = await db.pool.query(
      `UPDATE notifications 
       SET isRead = TRUE 
       WHERE userId = ? AND isRead = FALSE`,
      [userId],
    );
    return result.affectedRows;
  }

  async getUnreadCount(userId) {
    const [rows] = await db.pool.query(
      `SELECT COUNT(*) as count 
       FROM notifications 
       WHERE userId = ? AND isRead = FALSE`,
      [userId],
    );
    return rows[0].count;
  }

  async updateInvitationResponse(enrollmentId, status) {
    const message =
      status === 'accepted' ? 'You have accepted the course invitation' : 'You have declined the course invitation';

    const [result] = await db.pool.query(
      `UPDATE notifications 
       SET message = ?, isRead = TRUE 
       WHERE enrollmentId = ?`,
      [message, enrollmentId],
    );
    return result.affectedRows > 0;
  }
}

export const notificationModel = new Notification();
