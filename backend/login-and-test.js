const http = require('http');

function makeRequest(options, body = null) {
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data, headers: res.headers });
      });
    });

    req.on('error', (e) => {
      console.log(`Error: ${e.message}`);
      resolve({ status: 0, data: '', error: e.message });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function test() {
  console.log('Logging in...');
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

  console.log('Login Status:', loginRes.status);
  console.log('Login Response:', loginRes.data);

  const loginData = JSON.parse(loginRes.data);
  const token = loginData.token;

  if (!token) {
    console.log('Failed to get token');
    return;
  }

  console.log('\nToken:', token);

  const endpoints = [
    '/api/prescriptions?page=1&limit=100&search=',
    '/api/emergency-calls?page=1&limit=100&search=',
    '/api/blood-bank?page=1&limit=100&search='
  ];

  for (const endpoint of endpoints) {
    console.log(`\nTesting: ${endpoint}`);
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  }
}

test();
