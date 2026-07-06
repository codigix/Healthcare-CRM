/**
 * truncate-all-tables.js
 * Truncates all medixpro database tables (disables FK checks first, re-enables after).
 * Run with: node truncate-all-tables.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const tables = [
  // Dependent tables first (children before parents)
  'activity_logs',
  'appointments',
  'invoices',
  'insurance_claims',
  'prescriptions',
  'prescription_templates',
  'emergency_calls',
  'leave_requests',
  'attendance',
  'room_allotments',
  'blood_issues',
  'blood_units',
  'services',
  'medicine_stock_transactions',
  'medicine_batches',
  'inventory_alerts',
  // Parent / standalone tables
  'notifications',
  'records',
  'suppliers',
  'inventory_items',
  'medicines',
  'rooms',
  'staff',
  'roles',
  'departments',
  'ambulances',
  'blood_donors',
  'patients',
  'doctors',
  'specializations',
  'users',
];

async function truncateAll() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3307'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medixpro',
  });

  try {
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
    console.log('⚠️  Disabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0;');

    for (const table of tables) {
      try {
        await connection.execute(`TRUNCATE TABLE \`${table}\`;`);
        console.log(`  🗑️  Truncated: ${table}`);
      } catch (err) {
        console.warn(`  ⚠️  Skipped (${table}): ${err.message}`);
      }
    }

    console.log('✅ Re-enabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('\n🎉 All tables truncated successfully! Database is clean and ready for fresh data.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

truncateAll();
