const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medixpro',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    const docId = '1b5c8a9c-55af-4606-b50c-9d1d0d63ba01'; // sk sk doctorId
    
    const [allPatients] = await connection.query('SELECT id, name, doctorId FROM patients');
    console.log('All Patients in DB:');
    console.table(allPatients);

    const [filteredPatients] = await connection.query(
      `SELECT id, name, doctorId FROM patients p
       WHERE (p.doctorId = ? 
         OR p.id IN (SELECT DISTINCT patientId FROM appointments WHERE doctorId = ?) 
         OR p.id IN (SELECT DISTINCT patientId FROM prescriptions WHERE doctorId = ?))`,
      [docId, docId, docId]
    );
    console.log('Backend query results for sk sk:');
    console.table(filteredPatients);

    const [appts] = await connection.query(
      'SELECT a.id, p.name as patientName, a.doctorId FROM appointments a JOIN patients p ON a.patientId = p.id'
    );
    console.log('Appointments in DB:');
    console.table(appts);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

run();
