const http = require('http');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "healthcare_crm_jwt_secret_key_2025";

const testUserId = "dc610856-2d34-4686-b402-0a9679e95a50";
const token = jwt.sign(
  { id: testUserId, email: 'admin@hospital.com', role: 'admin' },
  JWT_SECRET,
  { expiresIn: '7d' }
);

console.log('Generated token:', token);
console.log('\n' + '='.repeat(80) + '\n');

function makeRequest(options, body = null) {
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', (e) => {
      console.error(`Request Error: ${e.message}`);
      resolve({ status: 0, body: '' });
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testWorkflow() {
  console.log('Testing patient search workflow with generated token...\n');
  
  const searches = [
    { term: 'sejal', expected: 'sejal kale' },
    { term: 'abhijit', expected: 'abhijit khedekar' },
    { term: 'sanika', expected: 'sanika' }
  ];

  for (const search of searches) {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/patients/search?name=${encodeURIComponent(search.term)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`\n🔍 Searching for: "${search.term}"`);
    console.log(`Status: ${result.status}`);
    
    try {
      const json = JSON.parse(result.body);
      if (result.status === 200 || result.status === 404) {
        console.log(`Response structure:`, Object.keys(json));
        if (json.patients) {
          console.log(`✅ Found patients: ${json.patients.map(p => p.name).join(', ') || 'none'}`);
        } else {
          console.log(`❌ Error: ${json.error}`);
        }
      } else {
        console.log(`Error status: ${result.status}`);
        console.log('Response:', json);
      }
    } catch (e) {
      console.log('Failed to parse JSON:', result.body.substring(0, 100));
    }
  }

  console.log('\n\n' + '='.repeat(80) + '\n');
  console.log('Testing doctor search workflow...\n');

  const doctorSearches = [
    { term: 'sanika', expected: 'sanika mote' },
    { term: 'rajesh', expected: 'rajesh kumar' },
    { term: 'neurology', expected: 'neurology' }
  ];

  for (const search of doctorSearches) {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/doctors/search?search=${encodeURIComponent(search.term)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`\n🔍 Searching doctors for: "${search.term}"`);
    console.log(`Status: ${result.status}`);
    
    try {
      const json = JSON.parse(result.body);
      if (result.status === 200 || result.status === 404) {
        console.log(`Response structure:`, Object.keys(json));
        if (json.doctors) {
          console.log(`✅ Found doctors: ${json.doctors.map(d => d.name).join(', ') || 'none'}`);
        } else {
          console.log(`❌ Error: ${json.error}`);
        }
      } else {
        console.log(`Error status: ${result.status}`);
        console.log('Response:', json);
      }
    } catch (e) {
      console.log('Failed to parse JSON:', result.body.substring(0, 100));
    }
  }
}

testWorkflow();
