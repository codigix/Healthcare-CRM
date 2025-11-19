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

    const limit = 10;
    const skip = 0;
    const search = '';

    let whereClause = '1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (medications LIKE ? OR diagnosis LIKE ? OR status LIKE ?)';
      const searchTerm = `%${String(search)}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    console.log('Where clause:', whereClause);
    console.log('Params:', params);

    const dataParams = [...params, Number(limit), skip];
    const query = `SELECT * FROM prescriptions WHERE ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`;
    console.log('Data query:', query);
    console.log('Data params:', dataParams);

    try {
      const [prescriptions] = await connection.query(query, dataParams);
      console.log('✅ Prescriptions:', prescriptions.length, 'records');
    } catch (err) {
      console.log('❌ Data query error:', err.message);
    }

    const countSql = `SELECT COUNT(*) as total FROM prescriptions WHERE ${whereClause}`;
    console.log('Count query:', countSql);
    console.log('Count params:', params);

    try {
      const [result] = await connection.query(countSql, params);
      console.log('✅ Count:', result[0].total);
    } catch (err) {
      console.log('❌ Count query error:', err.message);
    }

    connection.release();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

test();
