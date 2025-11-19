const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Backend',
      database: process.env.DB_NAME || 'medixpro',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    console.log('✓ Connected to database');

    console.log('\nTables in database:');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(tables.map(t => Object.values(t)[0]).join(', '));

    console.log('\n=== Testing Specific Tables ===');

    const tableTests = [
      { name: 'Prescription', query: 'SELECT COUNT(*) as count FROM Prescription' },
      { name: 'EmergencyCall', query: 'SELECT COUNT(*) as count FROM EmergencyCall' },
      { name: 'BloodInventory', query: 'SELECT COUNT(*) as count FROM BloodInventory' },
      { name: 'Ambulance', query: 'SELECT COUNT(*) as count FROM Ambulance' }
    ];

    for (const test of tableTests) {
      try {
        const [result] = await connection.query(test.query);
        console.log(`✓ ${test.name}: ${result[0].count} records`);
      } catch (err) {
        console.log(`✗ ${test.name}: ${err.message}`);
      }
    }

    console.log('\n=== Prescription Table Structure ===');
    try {
      const [cols] = await connection.query('DESCRIBE Prescription');
      console.log(cols.map(c => `${c.Field} (${c.Type})`).join('\n'));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }

    console.log('\n=== EmergencyCall Table Structure ===');
    try {
      const [cols] = await connection.query('DESCRIBE EmergencyCall');
      console.log(cols.map(c => `${c.Field} (${c.Type})`).join('\n'));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }

    console.log('\n=== BloodInventory Table Structure ===');
    try {
      const [cols] = await connection.query('DESCRIBE BloodInventory');
      console.log(cols.map(c => `${c.Field} (${c.Type})`).join('\n'));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('Database error:', err.message);
    process.exit(1);
  }
}

testConnection();
