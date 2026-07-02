import mysql from 'mysql2/promise';

const globalForDb = global as unknown as { db: mysql.Pool };

export const db = globalForDb.db || mysql.createPool({
  host: process.env.TIDB_HOST,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  port: Number(process.env.TIDB_PORT) || 4000,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 8,
  queueLimit: 0
});

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
