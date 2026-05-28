const mysql = require("mysql2/promise");
require("dotenv").config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'medixpro_user',
    password: process.env.DB_PASSWORD || 'C0digix$309',
    database: process.env.DB_NAME || 'medixpro',
    port: parseInt(process.env.DB_PORT || '3307'),
  });

  const connection = await pool.getConnection();
  try {
    console.log("Adding 'ventilator' column to rooms table...");
    await connection.query("ALTER TABLE rooms ADD COLUMN ventilator TINYINT(1) NOT NULL DEFAULT 0");
    console.log("✓ 'ventilator' column added successfully.");
  } catch (err) {
    if (err.code === "ER_DUP_COLUMN_NAME") {
      console.log("✓ 'ventilator' column already exists.");
    } else {
      console.error("✗ Failed to add 'ventilator' column:", err.message);
    }
  }

  try {
    console.log("Adding 'patientMonitor' column to rooms table...");
    await connection.query("ALTER TABLE rooms ADD COLUMN patientMonitor TINYINT(1) NOT NULL DEFAULT 0");
    console.log("✓ 'patientMonitor' column added successfully.");
  } catch (err) {
    if (err.code === "ER_DUP_COLUMN_NAME") {
      console.log("✓ 'patientMonitor' column already exists.");
    } else {
      console.error("✗ Failed to add 'patientMonitor' column:", err.message);
    }
  }

  connection.release();
  await pool.end();
  console.log("Migration finished successfully.");
}

run().catch(console.error);
