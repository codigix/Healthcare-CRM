require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3307'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Check invoices columns
    const [cols] = await conn.query('DESCRIBE invoices');
    console.log('=== INVOICES COLUMNS ===');
    cols.forEach(c => console.log(' -', c.Field, ':', c.Type));

    // Check finance-specific tables
    const tbls = [
      'vendor_bills', 'fixed_assets', 'finance_budgets', 'bank_transactions',
      'refund_requests', 'scheme_claims', 'finance_procurements', 'journal_entries'
    ];
    console.log('\n=== FINANCE TABLE ROW COUNTS ===');
    for (const t of tbls) {
      try {
        const [[row]] = await conn.query('SELECT COUNT(*) as cnt FROM ' + t);
        console.log(' [' + t + ']:', row.cnt, 'rows');
      } catch (e) {
        console.log(' [' + t + ']: NOT FOUND or ERROR -', e.message);
      }
    }
  } finally {
    await conn.end();
  }
}

run().catch(e => console.error('ERROR:', e.message));
