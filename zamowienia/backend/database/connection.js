import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: 'utf8mb4'
};

let connection;

export const connectDB = async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Połączono z MySQL');
    return connection;
  } catch (error) {
    console.error('❌ Błąd połączenia z MySQL:', error);
    throw error;
  }
};

export const getDB = () => {
  if (!connection) {
    throw new Error('Database not connected');
  }
  return connection;
};