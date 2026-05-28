const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function createTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'medixpro_user',
    password: process.env.DB_PASSWORD || 'C0digix$309',
    database: process.env.DB_NAME || 'medixpro',
    port: parseInt(process.env.DB_PORT || '3307')
  });

  console.log('Connected to MySQL. Creating notifications table...');

  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL DEFAULT 'info',
      senderId VARCHAR(36) NULL,
      senderName VARCHAR(255) NULL,
      receiverId VARCHAR(36) NULL,
      department VARCHAR(100) NULL,
      isRead TINYINT(1) NOT NULL DEFAULT 0,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  await connection.query(query);
  console.log('✓ Notifications table created or verified successfully!');
  await connection.end();
}

createTable().catch(e => {
  console.error('✗ Error creating notifications table:', e);
  process.exit(1);
});
