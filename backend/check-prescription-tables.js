const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Backend',
      database: process.env.DB_NAME || 'medixpro',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    const connection = await pool.getConnection();

    console.log('=== Prescriptions Table Structure ===');
    try {
      const [cols] = await connection.query('DESCRIBE prescriptions');
      console.log(cols.map(c => `${c.Field} (${c.Type})`).join('\n'));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }

    console.log('\n=== Emergency Calls Table Structure ===');
    try {
      const [cols] = await connection.query('DESCRIBE emergency_calls');
      console.log(cols.map(c => `${c.Field} (${c.Type})`).join('\n'));
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }

    console.log('\n=== Sample prescriptions data ===');
    const [pres] = await connection.query('SELECT * FROM prescriptions LIMIT 1');
    if (pres.length > 0) {
      console.log(JSON.stringify(pres[0], null, 2));
    } else {
      console.log('No data');
    }

    console.log('\n=== Sample emergency_calls data ===');
    const [emerg] = await connection.query('SELECT * FROM emergency_calls LIMIT 1');
    if (emerg.length > 0) {
      console.log(JSON.stringify(emerg[0], null, 2));
    } else {
      console.log('No data');
    }

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
