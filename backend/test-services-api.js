const http = require('http');

const BASE_URL = 'http://localhost:5000/api';
let authToken = null;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function login() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      email: 'admin@medixpro.com',
      password: 'password123'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          authToken = response.token;
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runTests() {
  try {
    console.log('\n=== Testing Services API ===\n');

    // Login first
    console.log('0. Logging in...');
    await login();
    console.log('✓ Logged in successfully\n');

    // Get departments
    console.log('1. Fetching departments...');
    const deptsRes = await makeRequest('GET', '/departments?limit=100');
    let departmentId;
    let departmentName;

    if (deptsRes.body.departments && deptsRes.body.departments.length > 0) {
      departmentId = deptsRes.body.departments[0].id;
      departmentName = deptsRes.body.departments[0].name;
      console.log(`✓ Found department: ${departmentName} (${departmentId})\n`);
    } else {
      // Create a department if none exists
      console.log('⚠ No departments found. Creating one...');
      const createDeptRes = await makeRequest('POST', '/departments', {
        name: 'Cardiology',
        head: 'Dr. Smith',
        location: 'Floor 3',
        staffCount: 10,
        description: 'Heart and cardiovascular services'
      });
      if (createDeptRes.status !== 201) {
        console.log('❌ Failed to create department:', createDeptRes.body);
        return;
      }
      departmentId = createDeptRes.body.id;
      departmentName = createDeptRes.body.name;
      console.log(`✓ Department created: ${departmentName} (${departmentId})\n`);
    }

    // Create a service
    console.log('2. Creating a service...');
    const createRes = await makeRequest('POST', '/departments/services', {
      name: 'ECG Test Service ' + Date.now(),
      departmentId: departmentId,
      type: 'Diagnostic',
      duration: 20,
      price: 150.00,
      description: 'Electrocardiogram test',
      status: 'Active'
    });
    if (createRes.status !== 201) {
      console.log('❌ Failed to create service:', createRes.body);
      return;
    }
    const serviceId = createRes.body.id;
    console.log(`✓ Service created: ${createRes.body.name} (${serviceId})\n`);

    // List services
    console.log('3. Listing services...');
    const listRes = await makeRequest('GET', '/departments/services?limit=10');
    if (listRes.status !== 200) {
      console.log(`❌ Failed to list services (Status ${listRes.status}):`, listRes.body);
      return;
    }
    console.log(`✓ Found ${listRes.body.services.length} services\n`);

    // Get service details
    console.log('4. Getting service details...');
    const getRes = await makeRequest('GET', `/departments/services/${serviceId}`);
    if (getRes.status !== 200) {
      console.log('❌ Failed to get service:', getRes.body);
      return;
    }
    console.log(`✓ Service details retrieved successfully\n`);

    // Update service
    console.log('5. Updating service...');
    const updateRes = await makeRequest('PUT', `/departments/services/${serviceId}`, {
      price: 175.00,
      description: 'Updated ECG test description'
    });
    if (updateRes.status !== 200) {
      console.log('❌ Failed to update service:', updateRes.body);
      return;
    }
    console.log(`✓ Service updated: ${updateRes.body.name} - Price: $${updateRes.body.price}\n`);

    // Create another service
    console.log('6. Creating another service...');
    const create2Res = await makeRequest('POST', '/departments/services', {
      name: 'Blood Test ' + Date.now(),
      departmentId: departmentId,
      type: 'Diagnostic',
      duration: 10,
      price: 45.00,
      description: 'Complete blood count',
      status: 'Active'
    });
    if (create2Res.status !== 201) {
      console.log('❌ Failed to create service:', create2Res.body);
      return;
    }
    console.log(`✓ Service created: ${create2Res.body.name}\n`);

    // List all services again
    console.log('7. Listing all services...');
    const listRes2 = await makeRequest('GET', '/departments/services?limit=10');
    console.log(`✓ Total services: ${listRes2.body.services.length}\n`);

    // Delete service
    console.log('8. Deleting service...');
    const deleteRes = await makeRequest('DELETE', `/departments/services/${serviceId}`);
    if (deleteRes.status !== 200) {
      console.log('❌ Failed to delete service:', deleteRes.body);
      return;
    }
    console.log(`✓ Service deleted successfully\n`);

    console.log('=== All tests passed! ===\n');
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  }
}

runTests();
