import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const dirName = path.dirname(fileURLToPath(import.meta.url));

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async init() {
    try {
      const schemaPath = path.join(dirName, '../schema.sql');
      const schema = await fs.readFile(schemaPath, 'utf8');

      const statements = schema
        .split(';')
        .map((statement) => statement.trim())
        .filter((statement) => statement.length > 0);

      const conn = await this.pool.getConnection();

      try {
        await Promise.all(statements.map((statement) => conn.query(statement)));
        console.log('Database schema initialized successfully');
      } finally {
        conn.release();
      }
    } catch (err) {
      console.error('Failed to initialize database schema:', err);
      throw err;
    }
  }
}

const db = new Database();
export default db;
