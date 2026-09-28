const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: '127.0.0.1', port: 3307, user: 'medixpro_user', password: 'C0digix$309', database: 'medixpro' });
  await conn.query('DELETE FROM patient_documents');
  console.log('Deleted old docs');
  process.exit(0);
}
run();
