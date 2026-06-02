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

  console.log('Creating "medicine_stock_transactions" database table in MySQL...');
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS medicine_stock_transactions (
        id VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci PRIMARY KEY,
        medicineId VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        type VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, -- RESTOCK, DISPENSE, ADJUSTMENT
        quantity INT NOT NULL,
        previousStock INT NOT NULL,
        newStock INT NOT NULL,
        notes TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (medicineId) REFERENCES medicines(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ Successfully created "medicine_stock_transactions" table.');
  } catch (err) {
    console.error('Error during setup:', err.message);
  } finally {
    await connection.end();
  }
}

main().catch(err => console.error(err));
