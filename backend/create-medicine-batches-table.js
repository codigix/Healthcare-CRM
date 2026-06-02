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

  console.log('Creating "medicine_batches" table and migrating existing stock...');
  try {
    // 1. Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS medicine_batches (
        id VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci PRIMARY KEY,
        medicineId VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        batchNumber VARCHAR(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        expiryDate DATETIME NOT NULL,
        purchasePrice DECIMAL(65,30) NOT NULL,
        sellingPrice DECIMAL(65,30) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (medicineId) REFERENCES medicines(id) ON DELETE CASCADE,
        UNIQUE KEY medicine_batch_uniq (medicineId, batchNumber)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ Successfully created "medicine_batches" table.');

    // 2. Migrate existing stocks from medicines table
    const [medicines] = await connection.query('SELECT * FROM medicines');
    let migratedCount = 0;

    for (const med of medicines) {
      if (med.initialQuantity > 0) {
        const batchNum = med.batchNumber || 'INITIAL-BATCH';
        const expiry = med.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year fallback
        
        await connection.query(`
          INSERT IGNORE INTO medicine_batches (id, medicineId, batchNumber, expiryDate, purchasePrice, sellingPrice, quantity)
          VALUES (UUID(), ?, ?, ?, ?, ?, ?)
        `, [
          med.id, 
          batchNum, 
          expiry, 
          med.purchasePrice || 0.0, 
          med.sellingPrice || 0.0, 
          med.initialQuantity
        ]);
        migratedCount++;
      }
    }
    console.log(`✓ Migrated existing stock for ${migratedCount} medicines into "medicine_batches".`);
  } catch (err) {
    console.error('Error during setup:', err.message);
  } finally {
    await connection.end();
  }
}

main().catch(err => console.error(err));
