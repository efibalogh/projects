import db from '../config/db.config.js';
import { enrollmentModel } from './enrollment.model.js';

export class Course {
  async getAll() {
    const [courses] = await db.pool.query(`
      SELECT c.*, u.name as courseOwnerName, u.email as courseOwnerEmail 
      FROM courses c 
      LEFT JOIN users u ON c.userId = u.id
    `);

    // Get enrollment counts for all courses
    const courseIds = courses.map((course) => course.id);
    const enrollmentCounts = await enrollmentModel.getEnrollmentCounts(courseIds);

    const coursesWithTasks = await Promise.all(
      courses.map(async (course) => {
        const [tasks] = await db.pool.query('SELECT * FROM tasks WHERE courseId = ?', [course.id]);
        return {
          ...course,
          tasks,
          enrollmentCount: enrollmentCounts[course.id] || 0,
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

  async get(id) {
    const [course] = await db.pool.query(
      `
      SELECT c.*, u.name as courseOwnerName, u.email as courseOwnerEmail 
      FROM courses c 
      LEFT JOIN users u ON c.userId = u.id 
      WHERE c.id = ?
    `,
      [id],
    );

    if (course.length === 0) throw new Error(`Course with ID ${id} not found!`);

    const [tasks] = await db.pool.query('SELECT * FROM tasks WHERE courseId = ?', [id]);
    const enrollmentCount = await enrollmentModel.getEnrollmentCount(id);

    return {
      ...course[0],
      tasks,
      enrollmentCount,
      courseOwner: course[0].courseOwnerName
        ? {
            id: course[0].userId,
            name: course[0].courseOwnerName,
            email: course[0].courseOwnerEmail,
          }
        : null,
    };
  }

  async getByCode(code) {
    const [course] = await db.pool.query(
      `
      SELECT c.*, u.name as courseOwnerName, u.email as courseOwnerEmail 
      FROM courses c 
      LEFT JOIN users u ON c.userId = u.id 
      WHERE c.code = ?
    `,
      [code],
    );

    if (course.length === 0) throw new Error(`Course with code ${code} not found!`);

    const [tasks] = await db.pool.query('SELECT * FROM tasks WHERE courseId = ?', [course[0].id]);
    const enrollmentCount = await enrollmentModel.getEnrollmentCount(course[0].id);

    return {
      ...course[0],
      tasks,
      enrollmentCount,
      courseOwner: course[0].courseOwnerName
        ? {
            id: course[0].userId,
            name: course[0].courseOwnerName,
            email: course[0].courseOwnerEmail,
          }
        : null,
    };
  }

  async create({ code, name, description, userId }) {
    const [existing] = await db.pool.query('SELECT id FROM courses WHERE code = ?', [code]);
    if (existing.length > 0) throw new Error(`Course with code ${code} already exists!`);

    const [result] = await db.pool.query('INSERT INTO courses (code, name, description, userId) VALUES (?, ?, ?, ?)', [
      code,
      name,
      description,
      userId,
    ]);

    return this.get(result.insertId);
  }

  async update(id, { code, name, description }) {
    const [course] = await db.pool.query('SELECT id FROM courses WHERE id = ?', [id]);
    if (course.length === 0) throw new Error(`Course with ID ${id} not found!`);

    // Check if code is being changed and if new code already exists
    if (code) {
      const [existing] = await db.pool.query('SELECT id FROM courses WHERE code = ? AND id != ?', [code, id]);
      if (existing.length > 0) throw new Error(`Course with code ${code} already exists!`);
    }

    const updateFields = [];
    const updateValues = [];

    if (code) {
      updateFields.push('code = ?');
      updateValues.push(code);
    }
    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }

    if (updateFields.length === 0) {
      return this.get(id);
    }

    updateValues.push(id);
    await db.pool.query(`UPDATE courses SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    return this.get(id);
  }

  async delete(id) {
    const [course] = await db.pool.query('SELECT id, code FROM courses WHERE id = ?', [id]);
    if (course.length === 0) throw new Error(`Course with ID ${id} not found!`);

    const [tasks] = await db.pool.query('SELECT filePath FROM tasks WHERE courseId = ?', [id]);

    await db.pool.query('DELETE FROM tasks WHERE courseId = ?', [id]);

    const [result] = await db.pool.query('DELETE FROM courses WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error(`Failed to delete course with ID ${id}!`);
    }

    return {
      message: `Course ${course[0].code} deleted successfully`,
      taskFiles: tasks.map((task) => task.filePath),
    };
  }

  async addTask(courseId, { name, deadline, file }) {
    const [course] = await db.pool.query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (course.length === 0) throw new Error(`Course with ID ${courseId} not found!`);

    const [result] = await db.pool.query('INSERT INTO tasks (courseId, name, deadline, filePath) VALUES (?, ?, ?, ?)', [
      courseId,
      name,
      deadline,
      file,
    ]);

    return {
      id: result.insertId,
      courseId,
      name,
      deadline,
      filePath: file,
    };
  }

  async getTask(taskId) {
    const [task] = await db.pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (task.length === 0) throw new Error(`Task with id ${taskId} not found!`);
    return task[0];
  }

  async updateTask(taskId, { name, deadline, file }) {
    const [task] = await db.pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (task.length === 0) throw new Error(`Task with id ${taskId} not found!`);

    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (deadline) {
      updateFields.push('deadline = ?');
      updateValues.push(deadline);
    }
    if (file) {
      updateFields.push('filePath = ?');
      updateValues.push(file);
    }

    if (updateFields.length === 0) {
      return this.getTask(taskId);
    }

    updateValues.push(taskId);

    await db.pool.query(`UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);

    return this.getTask(taskId);
  }

  async deleteTask(taskId) {
    const task = await db.pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]).then(([t]) => {
      if (t.length === 0) throw new Error(`Task with id ${taskId} not found!`);
      return t[0];
    });

    const [result] = await db.pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
    if (result.affectedRows === 0) throw new Error(`Failed to delete task with id ${taskId}!`);

    return { message: `Task '${task.name}' deleted successfully!` };
  }
}

export const courseModel = new Course();
