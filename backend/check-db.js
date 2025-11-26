const mysql = require('mysql2/promise');

async function checkDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'backend',
    database: 'medixpro'
  });

  console.log('Checking users table...');
  const [users] = await connection.query('SELECT id, name, email, role FROM users LIMIT 5');
  console.log('Users:', users);

  console.log('\nChecking patients table...');
  const [patients] = await connection.query('SELECT id, name, email FROM patients LIMIT 5');
  console.log('Patients:', patients);

  console.log('\nChecking doctors table...');
  const [doctors] = await connection.query('SELECT id, name, specialization FROM doctors LIMIT 5');
  console.log('Doctors:', doctors);

  console.log('\nSearching for "sejal"...');
  const [sejal] = await connection.query('SELECT * FROM patients WHERE LOWER(name) LIKE LOWER(?) LIMIT 5', ['%sejal%']);
  console.log('Results:', sejal);

  await connection.end();
}

checkDB().catch(e => console.error(e));
