const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRjNjEwODU2LTJkMzQtNDY4Ni1iNDAyLTBhOTY3OWU5NWE1MCIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDA0MzkyMn0.V_1l-Gp9R_MkT5XBq2f_QdW9QTpYNPZ0X6TaNq4YC_4';

function testSearch(searchTerm) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/patients/search?name=${encodeURIComponent(searchTerm)}`,
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
        console.log(`\n🔍 Searching for: "${searchTerm}"`);
        console.log(`Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          console.log('Response:', JSON.stringify(json, null, 2));
        } catch (e) {
          console.log('Response:', data);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Error: ${e.message}`);
      resolve();
    });
    req.end();
  });
}

async function runTests() {
  console.log('Testing patient search after backend restart...\n');
  await testSearch('sejal');
  await testSearch('abhijit');
}

runTests();
