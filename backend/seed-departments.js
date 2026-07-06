const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const roles = [
  { role: 'superadmin', name: 'Super Admin User', email: 'superadmin@medixpro.com', dept: 'Super Admin' },
  { role: 'admin', name: 'Admin User', email: 'admin@medixpro.com', dept: 'Administration' },
  { role: 'receptionist', name: 'Reception User', email: 'receptionist@medixpro.com', dept: 'Reception' },
  { role: 'doctor', name: 'Doctor User', email: 'doctor@medixpro.com', dept: 'Clinical' },
  { role: 'nurse', name: 'Nurse User', email: 'nurse@medixpro.com', dept: 'Nursing' },
  { role: 'laboratory', name: 'Diagnostics User', email: 'laboratory@medixpro.com', dept: 'Diagnostics' },
  { role: 'ot', name: 'OT User', email: 'ot@medixpro.com', dept: 'OT' },
  { role: 'pharmacy', name: 'Pharmacy User', email: 'pharmacy@medixpro.com', dept: 'Pharmacy' },
  { role: 'inventory', name: 'Inventory User', email: 'inventory@medixpro.com', dept: 'Inventory' },
  { role: 'finance', name: 'Finance User', email: 'finance@medixpro.com', dept: 'Finance' },
  { role: 'hr', name: 'HR User', email: 'hr@medixpro.com', dept: 'HR' },
  { role: 'records', name: 'Medical Records User', email: 'records@medixpro.com', dept: 'Records' },
  { role: 'crm', name: 'CRM User', email: 'crm@medixpro.com', dept: 'CRM' },
  { role: 'facilities', name: 'Facilities User', email: 'facilities@medixpro.com', dept: 'Facilities' },
  { role: 'it', name: 'IT User', email: 'it@medixpro.com', dept: 'IT' },
  { role: 'executive', name: 'Executive MIS User', email: 'executive@medixpro.com', dept: 'MIS' }
];

async function seedDepartments() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'medixpro_user',
    password: 'C0digix$309',
    database: 'medixpro',
    port: 3307
  });

  const password = await bcrypt.hash('password123', 10);

  for (const r of roles) {
    try {
      const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [r.email]);
      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO users (id, name, email, password, role, department, createdAt, updatedAt) VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())',
          [r.name, r.email, password, r.role, r.dept]
        );
        console.log(`Created user for ${r.role}`);
      } else {
        console.log(`User ${r.email} already exists.`);
      }
    } catch (e) {
      console.error(`Error creating user ${r.email}:`, e);
    }
  }

  await connection.end();
  console.log('Done seeding users.');
}

seedDepartments();
