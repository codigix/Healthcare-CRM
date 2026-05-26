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

  try {
    const [users] = await connection.query('SELECT id, name, email, role, department FROM users');
    console.log('Users:');
    console.table(users);

    const [doctors] = await connection.query('SELECT id, name, email, specialization FROM doctors');
    console.log('Doctors:');
    console.table(doctors);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

run();
