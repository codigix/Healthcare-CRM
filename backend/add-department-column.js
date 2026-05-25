const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medixpro',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  console.log('Connected to database.');

  try {
    // Check if column exists
    const [columns] = await connection.query('SHOW COLUMNS FROM users');
    const hasDepartment = columns.some(col => col.Field === 'department');

    if (!hasDepartment) {
      console.log('Adding "department" column to "users" table...');
      await connection.query('ALTER TABLE users ADD COLUMN department VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL');
      console.log('"department" column added successfully!');
    } else {
      console.log('"department" column already exists.');
    }
  } catch (error) {
    console.error('Error modifying users table:', error);
  } finally {
    await connection.end();
  }
}

run();
