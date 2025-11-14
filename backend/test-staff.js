const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
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

async function testStaffAPI() {
  console.log('Testing Staff API...\n');

  try {
    // Test GET all staff
    console.log('1. Testing GET /staff');
    const getResult = await makeRequest('GET', '/staff');
    console.log(`Status: ${getResult.status}`);
    console.log(`Response: ${getResult.body}\n`);

    // Test POST new staff
    console.log('2. Testing POST /staff');
    const newStaff = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'USA',
      role: 'Doctor',
      department: 'Cardiology',
      status: 'Active'
    };
    const postResult = await makeRequest('POST', '/staff', newStaff);
    console.log(`Status: ${postResult.status}`);
    console.log(`Response: ${postResult.body}\n`);

    if (postResult.status === 201) {
      const createdStaff = JSON.parse(postResult.body);
      const staffId = createdStaff.id;

      // Test GET single staff
      console.log('3. Testing GET /staff/:id');
      const getSingleResult = await makeRequest('GET', `/staff/${staffId}`);
      console.log(`Status: ${getSingleResult.status}`);
      console.log(`Response: ${getSingleResult.body}\n`);

      // Test PUT update staff
      console.log('4. Testing PUT /staff/:id');
      const updateData = { firstName: 'John Updated' };
      const putResult = await makeRequest('PUT', `/staff/${staffId}`, updateData);
      console.log(`Status: ${putResult.status}`);
      console.log(`Response: ${putResult.body}\n`);

      // Test DELETE staff
      console.log('5. Testing DELETE /staff/:id');
      const deleteResult = await makeRequest('DELETE', `/staff/${staffId}`);
      console.log(`Status: ${deleteResult.status}`);
      console.log(`Response: ${deleteResult.body}\n`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testStaffAPI();