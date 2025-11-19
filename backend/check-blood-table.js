const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkBloodTable() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Backend',
      database: process.env.DB_NAME || 'medixpro',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    const connection = await pool.getConnection();
    
    console.log('=== Blood Related Tables ===');
    const [tables] = await connection.query('SHOW TABLES LIKE "blood%"');
    console.log('Tables:', tables.map(t => Object.values(t)[0]).join(', '));

    console.log('\n=== Blood Units Structure ===');
    const [cols] = await connection.query('DESCRIBE blood_units');
    console.log(cols.map(c => `${c.Field} (${c.Type})`).join('\n'));

    console.log('\n=== Blood Donors Structure ===');
    const [cols2] = await connection.query('DESCRIBE blood_donors');
    console.log(cols2.map(c => `${c.Field} (${c.Type})`).join('\n'));

    console.log('\n=== Blood Issues Structure ===');
    const [cols3] = await connection.query('DESCRIBE blood_issues');
    console.log(cols3.map(c => `${c.Field} (${c.Type})`).join('\n'));

    console.log('\n=== Sample blood_units data ===');
    const [data] = await connection.query('SELECT * FROM blood_units LIMIT 2');
    console.log(data);

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkBloodTable();
