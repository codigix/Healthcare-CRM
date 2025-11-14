const http = require('http');

// Test the API endpoints
const tests = [
  { method: 'GET', path: '/api/health', name: 'Health Check' },
];

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          body: body,
          headers: res.headers
        });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Starting API Tests...\n');

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name} (${test.method} ${test.path})`);
      const result = await makeRequest(test.method, test.path);
      console.log(`Status: ${result.status}`);
      console.log(`Response: ${result.body.substring(0, 200)}\n`);
    } catch (error) {
      console.log(`Error: ${error.message}\n`);
    }
  }

  console.log('Tests completed!');
}

runTests();
