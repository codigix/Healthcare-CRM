const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'medixpro_user',
    password: process.env.DB_PASSWORD || 'C0digix$309',
    database: process.env.DB_NAME || 'medixpro',
    port: parseInt(process.env.DB_PORT || '3307'),
  });

  try {
    const [notifications] = await connection.query('SELECT * FROM notifications ORDER BY createdAt DESC LIMIT 10');
    console.log('Notifications (last 10):');
    console.table(notifications);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

run();
