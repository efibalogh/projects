import db from '../config/db.config.js';

export class User {
  async getAll() {
    const [rows] = await db.pool.query(
      `SELECT id, name, email, role, createdAt 
       FROM users
       ORDER BY name ASC`,
    );
    return rows;
  }

  async get(id) {
    const [rows] = await db.pool.query(
      `SELECT id, name, email, role, createdAt 
       FROM users 
       WHERE id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  async getByEmail(email) {
    const [rows] = await db.pool.query(
      `SELECT id, name, password, email, role, createdAt 
       FROM users 
       WHERE email = ?`,
      [email],
    );
    return rows[0] || null;
  }

  async create({ name, email, password, role = 'student' }) {
    const [result] = await db.pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES (?, ?, ?, ?)`,
      [name, email, password, role],
    );
    return this.get(result.insertId);
  }

  async getByEmailForInvitation(email) {
    const [rows] = await db.pool.query(
      `SELECT id, name, email, role 
       FROM users 
       WHERE email = ? AND role = 'student'`,
      [email],
    );
    return rows[0] || null;
  }

  async updateProfile(id, { name, email }) {
    const [result] = await db.pool.query(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name, email, id]);
    if (result.affectedRows === 0) {
      throw new Error('User not found');
    }
    return this.get(id);
  }

  async updatePassword(id, hashedPassword) {
    const [result] = await db.pool.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  async deleteAccount(id) {
    const [result] = await db.pool.query(`DELETE FROM users WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  async updateRole(id, role) {
    const [result] = await db.pool.query(`UPDATE users SET role = ? WHERE id = ?`, [role, id]);
    if (result.affectedRows === 0) {
      throw new Error('User not found');
    }
    return this.get(id);
  }
}

export const userModel = new User();
