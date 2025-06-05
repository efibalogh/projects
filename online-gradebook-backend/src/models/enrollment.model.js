import db from '../config/db.config.js';

export class Enrollment {
  async create({ courseId, userId, invitedBy }) {
    try {
      const [result] = await db.pool.query(
        `INSERT INTO course_enrollments (courseId, userId, invitedBy) 
         VALUES (?, ?, ?)`,
        [courseId, userId, invitedBy],
      );
      return this.get(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Student is already invited to this course');
      }
      throw error;
    }
  }

  async get(id) {
    const [rows] = await db.pool.query(
      `SELECT e.*, c.name as courseName, c.code as courseCode,
              u.name as studentName, u.email as studentEmail,
              t.name as teacherName
       FROM course_enrollments e
       JOIN courses c ON e.courseId = c.id
       JOIN users u ON e.userId = u.id
       JOIN users t ON e.invitedBy = t.id
       WHERE e.id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  async getByUserAndCourse(userId, courseId) {
    const [rows] = await db.pool.query(
      `SELECT * FROM course_enrollments 
       WHERE userId = ? AND courseId = ?`,
      [userId, courseId],
    );
    return rows[0] || null;
  }

  async getPendingInvitations(userId) {
    const [rows] = await db.pool.query(
      `SELECT e.*, c.name as courseName, c.code as courseCode,
              t.name as teacherName
       FROM course_enrollments e
       JOIN courses c ON e.courseId = c.id
       JOIN users t ON e.invitedBy = t.id
       WHERE e.userId = ? AND e.status = 'pending'
       ORDER BY e.createdAt DESC`,
      [userId],
    );
    return rows;
  }

  async getCourseStudents(courseId) {
    const [rows] = await db.pool.query(
      `SELECT e.*, u.name as studentName, u.email as studentEmail
       FROM course_enrollments e
       JOIN users u ON e.userId = u.id
       WHERE e.courseId = ? AND e.status = 'accepted'
       ORDER BY u.name`,
      [courseId],
    );
    return rows;
  }

  async updateStatus(id, status, userId) {
    const [result] = await db.pool.query(
      `UPDATE course_enrollments 
       SET status = ?, updatedAt = NOW() 
       WHERE id = ? AND userId = ?`,
      [status, id, userId],
    );
    return result.affectedRows > 0;
  }

  async getStudentCourses(userId) {
    const [rows] = await db.pool.query(
      `SELECT c.*, e.status as enrollmentStatus, e.createdAt as enrolledAt,
              u.name as courseOwnerName, u.email as courseOwnerEmail
       FROM courses c
       JOIN course_enrollments e ON c.id = e.courseId
       LEFT JOIN users u ON c.userId = u.id
       WHERE e.userId = ? AND e.status = 'accepted'
       ORDER BY c.name`,
      [userId],
    );

    const coursesWithTasks = await Promise.all(
      rows.map(async (course) => {
        const [tasks] = await db.pool.query('SELECT * FROM tasks WHERE courseId = ?', [course.id]);
        return {
          ...course,
          tasks,
          courseOwner: course.courseOwnerName
            ? {
                id: course.userId,
                name: course.courseOwnerName,
                email: course.courseOwnerEmail,
              }
            : null,
        };
      }),
    );

    return coursesWithTasks;
  }

  async getEnrollmentCount(courseId) {
    const [rows] = await db.pool.query(
      `SELECT COUNT(*) as count 
       FROM course_enrollments 
       WHERE courseId = ? AND status = 'accepted'`,
      [courseId],
    );
    return rows[0].count;
  }

  async getEnrollmentCounts(courseIds) {
    if (courseIds.length === 0) return {};

    const placeholders = courseIds.map(() => '?').join(',');
    const [rows] = await db.pool.query(
      `SELECT courseId, COUNT(*) as count 
       FROM course_enrollments 
       WHERE courseId IN (${placeholders}) AND status = 'accepted'
       GROUP BY courseId`,
      courseIds,
    );

    const countMap = {};
    rows.forEach((row) => {
      countMap[row.courseId] = row.count;
    });

    // Ensure all courseIds have a count (even if 0)
    courseIds.forEach((id) => {
      if (!(id in countMap)) {
        countMap[id] = 0;
      }
    });

    return countMap;
  }

  async removeAllEnrollments(userId) {
    const [result] = await db.pool.query(`DELETE FROM course_enrollments WHERE userId = ?`, [userId]);
    return result.affectedRows;
  }
}

export const enrollmentModel = new Enrollment();
