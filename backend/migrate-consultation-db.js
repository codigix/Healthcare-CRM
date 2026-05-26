const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'medixpro_user',
    password: process.env.DB_PASSWORD || 'C0digix$309',
    database: process.env.DB_NAME || 'medixpro',
    port: parseInt(process.env.DB_PORT || '3307'),
  });

  const connection = await pool.getConnection();
  console.log('=== Starting Database Schema Enhancements ===');

  try {
    // Modify prescriptions.medications to TEXT
    console.log('Adjusting prescriptions.medications size constraints to TEXT...');
    await connection.query('ALTER TABLE prescriptions MODIFY medications TEXT NOT NULL');
    console.log('✓ Successfully modified prescriptions.medications to TEXT');
  } catch (err) {
    console.log('Note / Error modifying prescriptions.medications:', err.message);
  }

  try {
    // Modify appointments.notes to TEXT
    console.log('Adjusting appointments.notes size constraints to TEXT...');
    await connection.query('ALTER TABLE appointments MODIFY notes TEXT NULL');
    console.log('✓ Successfully modified appointments.notes to TEXT');
  } catch (err) {
    console.log('Note / Error modifying appointments.notes:', err.message);
  }

  // Safe helper to append nullable columns
  async function addColumnIfNotExists(table, column, definition) {
    try {
      const [cols] = await connection.query(`SHOW COLUMNS FROM ${table} LIKE '${column}'`);
      if (cols.length === 0) {
        console.log(`Adding nullable relation column [${column}] to [${table}]...`);
        await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        console.log(`✓ Added column [${column}] to [${table}] successfully`);
      } else {
        console.log(`Column [${column}] already exists in table [${table}]`);
      }
    } catch (err) {
      console.log(`Error adding [${column}] to [${table}]:`, err.message);
    }
  }

  await addColumnIfNotExists('prescriptions', 'appointmentId', 'VARCHAR(191) NULL');
  await addColumnIfNotExists('records', 'appointmentId', 'VARCHAR(191) NULL');
  await addColumnIfNotExists('records', 'patientId', 'VARCHAR(191) NULL');
  await addColumnIfNotExists('records', 'doctorId', 'VARCHAR(191) NULL');

  connection.release();
  console.log('=== Database Schema Enhancements Complete ===');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
