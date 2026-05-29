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

  console.log('Altering medicines table to add department column...');
  try {
    // Check if column already exists
    const [columns] = await connection.query('SHOW COLUMNS FROM medicines LIKE "department"');
    if (columns.length > 0) {
      console.log('✓ "department" column already exists in medicines.');
    } else {
      await connection.query("ALTER TABLE medicines ADD COLUMN department VARCHAR(191) DEFAULT 'Pharmacy'");
      console.log('✓ Successfully added "department" column to medicines table.');
    }

    // Migrate existing inventory items:
    // Categories like 'Medical Supplies', 'Equipment', 'Office Supplies' should be flagged as 'Inventory'
    console.log('Migrating existing inventory categories...');
    const inventoryCategories = ['Medical Supplies', 'Equipment', 'Office Supplies', 'Consumables', 'Assets', 'Hospital Equipment'];
    
    for (const cat of inventoryCategories) {
      const [result] = await connection.query(
        "UPDATE medicines SET department = 'Inventory' WHERE category = ?",
        [cat]
      );
      if (result.affectedRows > 0) {
        console.log(`✓ Migrated ${result.affectedRows} items under category "${cat}" to Inventory department.`);
      }
    }
    
    // Ensure all other items (like 'Antibiotics', 'Analgesics' etc) have department set to 'Pharmacy'
    const [pharmaResult] = await connection.query(
      "UPDATE medicines SET department = 'Pharmacy' WHERE department IS NULL OR department = ''"
    );
    if (pharmaResult.affectedRows > 0) {
      console.log(`✓ Settled ${pharmaResult.affectedRows} other items to Pharmacy department.`);
    }

    console.log('✓ Database migration completed successfully!');
  } catch (err) {
    console.error('Error during migration:', err.message);
  } finally {
    await connection.end();
  }
}

main().catch(err => console.error(err));
