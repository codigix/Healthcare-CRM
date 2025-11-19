const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTable() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Backend',
      database: process.env.DB_NAME || 'medixpro',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    const connection = await pool.getConnection();
    
    console.log('=== Ambulances Table Structure ===');
    try {
      const [cols] = await connection.query('DESCRIBE ambulances');
      console.log(cols.map(c => `${c.Field} (${c.Type})`).join('\n'));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }

    console.log('\n=== Sample ambulances data ===');
    const [data] = await connection.query('SELECT * FROM ambulances LIMIT 2');
    console.log(data);

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkTable();
