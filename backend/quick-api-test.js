const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2ZTA0ZjcxLWU2YzktNDZlZi1iOTI5LWQ2MjljZGJkZjY3NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMTkxNTcxOH0.r-U4lOxJ_p7xRCjXSMI_RWrPHmNgJ-dKQI_RhMPz-3s';

const endpoints = [
  '/api/prescriptions?page=1&limit=100&search=',
  '/api/emergency-calls?page=1&limit=100&search=',
  '/api/blood-bank?page=1&limit=100&search='
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n${endpoint}`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response:`, data);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`Error: ${e.message}`);
      resolve();
    });
    req.end();
  });
}

async function runTests() {
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
  }
}

runTests();
