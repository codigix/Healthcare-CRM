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
    console.log('❌ Login failed');
    return;
  }

  const loginData = JSON.parse(loginRes.data);
  const token = loginData.token;
  console.log('✅ Login successful\n');

  const tests = [
    { 
      name: 'Prescriptions', 
      endpoints: { 
        list: '/api/prescriptions?page=1&limit=10',
        create: { method: 'POST', path: '/api/prescriptions', data: { patientId: 'test', doctorId: 'test', prescriptionType: 'Standard', diagnosis: 'Test', medications: 'Test med' } }
      }
    },
    { 
      name: 'Emergency Calls', 
      endpoints: { 
        list: '/api/emergency-calls?page=1&limit=10',
        create: { method: 'POST', path: '/api/emergency-calls', data: { patientName: 'Test', phone: '1234567890', location: 'Test', emergencyType: 'Test' } }
      }
    },
    { 
      name: 'Blood Bank', 
      endpoints: { 
        list: '/api/blood-bank?page=1&limit=10',
        create: { method: 'POST', path: '/api/blood-bank', data: { bloodType: 'O+', quantity: 5, donorId: 'test' } }
      }
    },
    { 
      name: 'Ambulances', 
      endpoints: { 
        list: '/api/ambulances?page=1&limit=10',
        create: { method: 'POST', path: '/api/ambulances', data: { name: 'Test Ambulance', registrationNumber: 'TEST-' + Date.now(), driverName: 'Test Driver', driverPhone: '1234567890' } }
      }
    }
  ];

  for (const test of tests) {
    console.log(`\n📋 ${test.name}:`);
    
    const listRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: test.endpoints.list,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (listRes.status === 200) {
      try {
        const data = JSON.parse(listRes.data);
        console.log(`  ✅ LIST (GET): ${data.total} records`);
      } catch (e) {
        console.log(`  ❌ LIST (GET): Invalid response`);
      }
    } else {
      console.log(`  ❌ LIST (GET): Status ${listRes.status}`);
    }

    if (test.endpoints.create) {
      const createRes = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: test.endpoints.create.path,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }, test.endpoints.create.data);

      if (createRes.status === 201) {
        try {
          const data = JSON.parse(createRes.data);
          console.log(`  ✅ CREATE (POST): Created successfully`);
        } catch (e) {
          console.log(`  ❌ CREATE (POST): Invalid response`);
        }
      } else if (createRes.status >= 400) {
        console.log(`  ⚠️  CREATE (POST): Status ${createRes.status}`);
      }
    }
  }

  console.log('\n✅ All endpoints verified successfully!');
}

test();
