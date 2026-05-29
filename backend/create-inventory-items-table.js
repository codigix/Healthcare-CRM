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

  console.log('Creating "inventory_items" database table in MySQL...');
  try {
    // 1. Create table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS inventory_items (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(191) UNIQUE NOT NULL,
        category VARCHAR(191) NOT NULL,
        description TEXT,
        unitType VARCHAR(191) NOT NULL,
        supplier VARCHAR(191),
        purchaseDate DATETIME(3) NULL,
        expiryDate DATETIME(3) NULL,
        initialQuantity INT DEFAULT 0,
        reorderLevel INT DEFAULT 0,
        maximumLevel INT DEFAULT 0,
        purchasePrice DECIMAL(65, 30) NOT NULL,
        sellingPrice DECIMAL(65, 30) NOT NULL,
        status VARCHAR(191) DEFAULT 'Active',
        notes TEXT,
        createdAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
      )
    `);
    console.log('✓ Successfully created "inventory_items" table.');

    // 2. Query all inventory items from medicines table
    console.log('Querying existing inventory items from medicines table...');
    
    // Check if department column exists in medicines
    const [cols] = await connection.query('SHOW COLUMNS FROM medicines LIKE "department"');
    let inventoryMedicines = [];
    
    if (cols.length > 0) {
      const [rows] = await connection.query("SELECT * FROM medicines WHERE department = 'Inventory'");
      inventoryMedicines = rows;
    } else {
      // Fallback to category based query if department column is missing
      const [rows] = await connection.query(`
        SELECT * FROM medicines 
        WHERE category IN ('Medical Supplies', 'Equipment', 'Office Supplies', 'Consumables', 'Assets', 'Hospital Equipment')
      `);
      inventoryMedicines = rows;
    }
    
    console.log(`Found ${inventoryMedicines.length} inventory items to migrate.`);

    // 3. Migrate items
    for (const item of inventoryMedicines) {
      try {
        await connection.query(`
          INSERT INTO inventory_items (
            id, name, category, description, unitType, supplier, purchaseDate, expiryDate,
            initialQuantity, reorderLevel, maximumLevel, purchasePrice, sellingPrice, status, notes, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          item.id,
          item.name,
          item.category,
          item.description || null,
          item.medicineForm || 'Piece', // medicineForm maps to unitType
          item.supplier || null,
          item.manufacturingDate || null, // manufacturingDate maps to purchaseDate
          item.expiryDate || null,
          item.initialQuantity || 0,
          item.reorderLevel || 0,
          item.maximumLevel || 0,
          item.purchasePrice || 0,
          item.sellingPrice || 0,
          item.status || 'Active',
          item.description || null, // notes
          item.createdAt || new Date(),
          item.updatedAt || new Date()
        ]);
        console.log(`✓ Migrated item "${item.name}" to inventory_items table.`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️ Item "${item.name}" already exists in inventory_items.`);
        } else {
          console.error(`✗ Error migrating "${item.name}":`, err.message);
        }
      }
    }

    // 4. Remove migrated items from medicines table
    if (inventoryMedicines.length > 0) {
      const ids = inventoryMedicines.map(m => m.id);
      console.log(`Cleaning up ${ids.length} inventory items from medicines table...`);
      await connection.query("DELETE FROM medicines WHERE id IN (?)", [ids]);
      console.log('✓ Cleanup of medicines table completed.');
    }

    // 5. Drop department column from medicines
    if (cols.length > 0) {
      console.log('Dropping temporary "department" column from medicines...');
      await connection.query("ALTER TABLE medicines DROP COLUMN department");
      console.log('✓ Successfully dropped "department" column.');
    }

    console.log('✓ Database migration to separate tables completed successfully!');
  } catch (err) {
    console.error('Error during migration:', err.message);
  } finally {
    await connection.end();
  }
}

main().catch(err => console.error(err));
