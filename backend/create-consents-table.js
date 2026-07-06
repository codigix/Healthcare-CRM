const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.production' });

async function createConsentsTable() {
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbHost = process.env.DB_HOST || '127.0.0.1';
  const dbPort = process.env.DB_PORT || '3306';
  const dbName = process.env.DB_NAME || 'medixpro';

  console.log(`Connecting to ${dbUser}@${dbHost}:${dbPort}/${dbName}`);

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: parseInt(dbPort)
    });

    console.log('Connected to database. Creating consents table...');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS consents (
        id VARCHAR(191) NOT NULL,
        patientId VARCHAR(191) NOT NULL,
        type VARCHAR(191) NOT NULL,
        department VARCHAR(191) NOT NULL,
        visitType VARCHAR(191) NOT NULL,
        doctorId VARCHAR(191),
        signedBy VARCHAR(191) NOT NULL,
        witness VARCHAR(191) NOT NULL,
        status VARCHAR(191) NOT NULL DEFAULT 'Pending Signature',
        version VARCHAR(191) NOT NULL DEFAULT 'v1.0',
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createTableQuery);
    console.log('consents table created successfully.');

    await connection.end();
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

createConsentsTable();
