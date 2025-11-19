const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Backend',
      database: process.env.DB_NAME || 'medixpro',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    const connection = await pool.getConnection();

    console.log('Testing prescriptions query...');
    try {
      const [result] = await connection.query('SELECT * FROM prescriptions LIMIT 10');
      console.log('✅ Prescriptions:', result.length, 'records');
    } catch (err) {
      console.log('❌ Error:', err.message);
    }

    console.log('\nTesting emergency_calls query...');
    try {
      const [result] = await connection.query('SELECT * FROM emergency_calls LIMIT 10');
      console.log('✅ Emergency calls:', result.length, 'records');
    } catch (err) {
      console.log('❌ Error:', err.message);
    }

    console.log('\nTesting blood_units query...');
    try {
      const [result] = await connection.query('SELECT * FROM blood_units LIMIT 10');
      console.log('✅ Blood units:', result.length, 'records');
    } catch (err) {
      console.log('❌ Error:', err.message);
    }

    console.log('\nTesting ambulances query...');
    try {
      const [result] = await connection.query('SELECT * FROM ambulances LIMIT 10');
      console.log('✅ Ambulances:', result.length, 'records');
    } catch (err) {
      console.log('❌ Error:', err.message);
    }

    console.log('\nTesting count query for prescriptions...');
    try {
      const query = 'SELECT * FROM prescriptions WHERE 1=1';
      const countQuery = query;
      const countSql = `SELECT COUNT(*) as total FROM prescriptions WHERE 1=1` + countQuery.substring(countQuery.indexOf('WHERE')).replace('ORDER BY created_at DESC LIMIT ? OFFSET ?', '');
      console.log('Count SQL:', countSql);
      const [result] = await connection.query(countSql, []);
      console.log('✅ Count:', result[0].total);
    } catch (err) {
      console.log('❌ Error:', err.message);
    }

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

test();
