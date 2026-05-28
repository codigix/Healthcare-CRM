const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'medixpro_user',
    password: process.env.DB_PASSWORD || 'C0digix$309',
    database: process.env.DB_NAME || 'medixpro',
    port: parseInt(process.env.DB_PORT || '3307'),
  });

  try {
    // 1. Fetch completed appointments for payal jagtap
    const [appointments] = await connection.query(
      `SELECT a.id, a.notes, p.name as patientName 
       FROM appointments a 
       JOIN patients p ON a.patientId = p.id 
       WHERE p.name LIKE '%payal%' AND a.status = 'Completed'`
    );

    console.log(`Found ${appointments.length} completed appointments for Payal.`);

    for (const apt of appointments) {
      if (apt.notes) {
        try {
          const notesObj = JSON.parse(apt.notes);
          if (notesObj.labRequestSent) {
            notesObj.labRequestSent = false;
            const updatedNotes = JSON.stringify(notesObj);
            
            await connection.query(
              'UPDATE appointments SET notes = ? WHERE id = ?',
              [updatedNotes, apt.id]
            );
            console.log(`✓ Reset labRequestSent to false for appointment ID: ${apt.id}`);
          }
        } catch (e) {
          console.error(`Failed to parse/update notes for appointment ${apt.id}`);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

run();
