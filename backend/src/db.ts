import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'medixpro',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log(`✓connected successfully to database ${process.env.DB_NAME} `);
    connection.release();
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
  });

export default pool;
