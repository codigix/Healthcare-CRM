const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medixpro',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    const columns = [
      'altPhone VARCHAR(20)',
      'city VARCHAR(100)',
      'district VARCHAR(100)',
      'state VARCHAR(100)',
      'pincode VARCHAR(20)',
      
      'aadhaarNo VARCHAR(50)',
      'abhaId VARCHAR(50)',
      'panPassport VARCHAR(50)',
      
      'emgName VARCHAR(100)',
      'emgRelation VARCHAR(50)',
      'emgPhone VARCHAR(20)',
      'emgAddress VARCHAR(255)',
      
      'height DECIMAL(5,2)',
      'weight DECIMAL(5,2)',
      'allergies TEXT',
      'chronicDiseases TEXT',
      
      'insuranceCompany VARCHAR(100)',
      'tpaName VARCHAR(100)',
      'policyNo VARCHAR(100)',
      'policyValidity DATE',
      'isCashless BOOLEAN DEFAULT FALSE',
      
      'schemeName VARCHAR(100)',
      'schemeNo VARCHAR(100)'
    ];

    for (const col of columns) {
      const colName = col.split(' ')[0];
      try {
        await pool.query(`ALTER TABLE patients ADD COLUMN ${col}`);
        console.log(`Added column ${colName}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column ${colName} already exists`);
        } else {
          console.error(`Error adding column ${colName}:`, err.message);
        }
      }
    }
    
    console.log('Migration complete');
  } catch (err) {
    console.error('Migration failed', err);
  } finally {
    await pool.end();
  }
}

migrate();
