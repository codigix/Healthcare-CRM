require('dotenv').config();
const http = require('http');

// First login to get a token
async function loginAndTest() {
  const loginData = JSON.stringify({ email: 'admin@medixpro.com', password: 'Admin@123' });

  const token = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': loginData.length }
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed.token);
        } catch (e) { reject(new Error('Login parse error: ' + body)); }
      });
    });
    req.on('error', reject);
    req.write(loginData);
    req.end();
  });

  if (!token) throw new Error('No token received');
  console.log('✅ Logged in successfully');

  // Test each finance endpoint
  const endpoints = [
    '/api/finance/dashboard-stats',
    '/api/finance/revenue-trends',
    '/api/finance/expense-trends',
    '/api/finance/chart-of-accounts',
    '/api/finance/journal-entries',
    '/api/finance/vendor-bills',
    '/api/finance/aging-report',
    '/api/finance/government-schemes',
    '/api/finance/bank-statements',
    '/api/finance/payroll',
    '/api/finance/assets',
    '/api/finance/budgets',
    '/api/finance/refunds',
    '/api/finance/procurements',
    '/api/finance/ar-details',
    '/api/finance/taxable-sales',
  ];

  for (const ep of endpoints) {
    try {
      const result = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 5000,
          path: ep,
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        }, (res) => {
          let body = '';
          res.on('data', d => body += d);
          res.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              resolve({ status: res.statusCode, data: parsed });
            } catch (e) { resolve({ status: res.statusCode, raw: body.slice(0, 200) }); }
          });
        });
        req.on('error', reject);
        req.end();
      });

      if (result.status === 200) {
        const count = Array.isArray(result.data) ? result.data.length : 'object';
        console.log(`✅ ${ep} → ${result.status} (${count} items/keys)`);
        // Print sample data for stats
        if (ep === '/api/finance/dashboard-stats') {
          console.log('   Stats:', JSON.stringify(result.data));
        }
      } else {
        console.log(`❌ ${ep} → ${result.status}`, result.data?.error || result.raw);
      }
    } catch (err) {
      console.log(`💥 ${ep} → EXCEPTION: ${err.message}`);
    }
  }
}

loginAndTest().catch(e => console.error('FATAL:', e.message));
