const mysql = require('mysql2/promise');

async function check() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'medixpro'
    });
    const [rows] = await connection.query("SHOW TABLES LIKE 'insurance_claims'");
    console.log('insurance_claims table:', rows.length > 0 ? 'EXISTS' : 'NOT FOUND');
    
    const [rows2] = await connection.query("SHOW TABLES LIKE 'InsuranceClaim'");
    console.log('InsuranceClaim table:', rows2.length > 0 ? 'EXISTS' : 'NOT FOUND');

    const [rows3] = await connection.query("SHOW TABLES LIKE 'scheme_claims'");
    console.log('scheme_claims table:', rows3.length > 0 ? 'EXISTS' : 'NOT FOUND');
    
    await connection.end();
  } catch (e) {
    console.error('Error:', e.message);
  }
}

check();
