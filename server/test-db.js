const { pool } = require('./config/database');

async function testDB() {
  try {
    const [users] = await pool.execute('SELECT id, email, role FROM users LIMIT 5');
    console.log('Users in database:', users);

    const [admin] = await pool.execute('SELECT * FROM users WHERE email = ?', ['admin@hospital.com']);
    console.log('Admin user:', admin);
  } catch (error) {
    console.error('DB Error:', error);
  } finally {
    process.exit();
  }
}

testDB();