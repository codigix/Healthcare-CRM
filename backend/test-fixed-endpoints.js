const http = require('http');

function makeRequest(options, body = null) {
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (e) => {
      resolve({ status: 0, data: e.message, error: true });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function test() {
  console.log('🔐 Logging in...');
  const loginRes = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@medixpro.com',
    password: 'password123'
  });

  if (loginRes.status !== 200) {
    console.log('❌ Login failed:', loginRes.data);
    return;
  }

  try {
    const loginData = JSON.parse(loginRes.data);
    const token = loginData.token;
    console.log('✅ Login successful');

    const endpoints = [
      { path: '/api/prescriptions?page=1&limit=10&search=', name: 'Prescriptions' },
      { path: '/api/emergency-calls?page=1&limit=10&search=', name: 'Emergency Calls' },
      { path: '/api/blood-bank?page=1&limit=10&search=', name: 'Blood Bank' },
      { path: '/api/ambulances?page=1&limit=10&search=', name: 'Ambulances' }
    ];

    for (const endpoint of endpoints) {
      const res = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: endpoint.path,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.error) {
        console.log(`\n❌ ${endpoint.name}: Connection Error`);
        console.log(`   Error: ${res.data}`);
      } else {
        console.log(`\n${endpoint.name}:`);
        console.log(`   Status: ${res.status}`);
        
        if (res.status === 200) {
          try {
            const data = JSON.parse(res.data);
            console.log(`   ✅ Response: ${Object.keys(data).join(', ')}`);
            if (data.total !== undefined) {
              console.log(`   Total records: ${data.total}`);
            }
          } catch (e) {
            console.log(`   ❌ Invalid JSON response`);
          }
        } else {
          console.log(`   ❌ Error: ${res.data.substring(0, 100)}`);
        }
      }
    }
  } catch (e) {
    console.log('❌ Error parsing login response:', e.message);
  }
}

test();
