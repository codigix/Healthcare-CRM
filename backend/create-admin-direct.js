require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function createAdmin() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3307'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const password = await bcrypt.hash('Admin@123', 10);
    const id = uuidv4();
    const now = new Date();

    await conn.execute(
      'INSERT INTO users (id, name, email, password, role, department, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, 'Admin User', 'admin@medixpro.com', password, 'admin', 'Administration', now, now]
    );
    console.log('✅ Admin user created: admin@medixpro.com / Admin@123');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️  Admin already exists');
    } else {
      console.error('❌ Error:', err.message);
    }
  } finally {
    await conn.end();
  }
}

createAdmin();
