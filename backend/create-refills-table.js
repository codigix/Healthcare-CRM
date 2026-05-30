const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medixpro',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  console.log('Creating "pharmacy_refill_requests" database table in MySQL...');
  try {
    // 1. Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pharmacy_refill_requests (
        id VARCHAR(191) PRIMARY KEY,
        medicineName VARCHAR(191) NOT NULL,
        quantityRequested INT NOT NULL,
        status VARCHAR(191) NOT NULL DEFAULT 'Pending', -- Pending, Approved, Issued, Completed
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Successfully created "pharmacy_refill_requests" table.');

    // 2. Clear existing entries to prevent duplicates in seed
    await connection.query('DELETE FROM pharmacy_refill_requests');

    // 3. Seed mock data
    const mockRefills = [
      {
        id: 'REQ-RF001',
        medicineName: 'Amoxicillin 500mg',
        quantityRequested: 100,
        status: 'Pending',
        notes: 'Urgent refill. Pending prescription backlog is growing.'
      },
      {
        id: 'REQ-RF002',
        medicineName: 'Ibuprofen 200mg',
        quantityRequested: 150,
        status: 'Approved',
        notes: 'Approved by clinical inventory audit board.'
      },
      {
        id: 'REQ-RF003',
        medicineName: 'Surgical Gloves (Medium)',
        quantityRequested: 200,
        status: 'Issued',
        notes: 'Dispatched from central operational warehouse. In transit to pharmacy.'
      },
      {
        id: 'REQ-RF004',
        medicineName: 'Paracetamol 500mg',
        quantityRequested: 300,
        status: 'Completed',
        notes: 'Refill completed. Stock refreshed.'
      }
    ];

    for (const refill of mockRefills) {
      await connection.query(`
        INSERT INTO pharmacy_refill_requests (id, medicineName, quantityRequested, status, notes)
        VALUES (?, ?, ?, ?, ?)
      `, [refill.id, refill.medicineName, refill.quantityRequested, refill.status, refill.notes]);
    }
    console.log('✓ Seeded mock pharmacy refill requests.');
    console.log('✓ Database setup completed successfully!');
  } catch (err) {
    console.error('Error during setup:', err.message);
  } finally {
    await connection.end();
  }
}

main().catch(err => console.error(err));
