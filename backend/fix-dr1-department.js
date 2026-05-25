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

  console.log('Connected to database to update user departments.');

  try {
    // Set department for doctor role users
    console.log('Updating doctors without department to "Doctor" department...');
    const [result] = await connection.query(
      "UPDATE users SET department = 'Doctor' WHERE role = 'doctor' AND (department IS NULL OR department = '')"
    );
    console.log(`Updated ${result.affectedRows} doctor(s).`);

    // Set department for admin role users
    console.log('Updating admins without department to "Admin" department...');
    const [adminResult] = await connection.query(
      "UPDATE users SET department = 'Admin' WHERE role = 'admin' AND (department IS NULL OR department = '')"
    );
    console.log(`Updated ${adminResult.affectedRows} admin(s).`);
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await connection.end();
  }
}

run();
