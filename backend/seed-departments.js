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

  console.log('Connected to database to seed departments.');

  const departments = [
    {
      name: 'Admin',
      head: 'System Admin',
      location: 'Building A, Floor 4',
      staffCount: 2,
      services: 4,
      status: 'Active',
      description: 'Central administrative and systems control department'
    },
    {
      name: 'Doctor',
      head: 'Dr. Sarah Jenkins',
      location: 'Building B, Floor 2',
      staffCount: 12,
      services: 6,
      status: 'Active',
      description: 'Primary patient care, consultations, and specialized medical treatments'
    },
    {
      name: 'Inventory',
      head: 'Mr. Robert Chen',
      location: 'Building C, Floor 1',
      staffCount: 4,
      services: 3,
      status: 'Active',
      description: 'Pharmacy stock, medical equipment, and clinical supplies management'
    },
    {
      name: 'Laboratory',
      head: 'Dr. Eleanor Vance',
      location: 'Building C, Floor 2',
      staffCount: 6,
      services: 5,
      status: 'Active',
      description: 'Diagnostic testing, pathology analysis, and blood bank operations'
    },
    {
      name: 'Receptionist',
      head: 'Ms. Clara Oswald',
      location: 'Main Lobby, Ground Floor',
      staffCount: 5,
      services: 2,
      status: 'Active',
      description: 'Patient inquiries, registration, appointments booking, and billing help'
    }
  ];

  try {
    for (const dept of departments) {
      // Check if department already exists
      const [existing] = await connection.query('SELECT id FROM departments WHERE name = ?', [dept.name]);
      if (existing.length === 0) {
        console.log(`Seeding department: ${dept.name}`);
        const query = `INSERT INTO departments (id, name, head, location, staffCount, services, status, description, createdAt, updatedAt)
                       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
        await connection.query(query, [
          dept.name,
          dept.head,
          dept.location,
          dept.staffCount,
          dept.services,
          dept.status,
          dept.description
        ]);
        console.log(`Department "${dept.name}" created successfully!`);
      } else {
        console.log(`Department "${dept.name}" already exists.`);
      }
    }
  } catch (error) {
    console.error('Error seeding departments:', error);
  } finally {
    await connection.end();
  }
}

run();
