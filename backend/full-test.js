const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function test() {
  let token = null;

  try {
    console.log('=== Medicines API Full Test ===\n');

    // Step 1: Try to login with existing user
    console.log('Step 1: Attempting login...');
    let loginRes = await request('POST', '/auth/login', {
      email: 'admin@medixpro.com',
      password: 'password123',
    });

    if (loginRes.status === 200) {
      token = loginRes.data.token;
      console.log('✓ Logged in successfully\n');
    } else {
      console.log('✗ Login failed, registering new user...');
      // Register new user
      const registerRes = await request('POST', '/auth/register', {
        name: 'Test Admin',
        email: `test${Date.now()}@medixpro.com`,
        password: 'Test@123',
        role: 'admin',
      });

      if (registerRes.status === 201) {
        token = registerRes.data.token;
        console.log('✓ Registered and logged in\n');
      } else {
        console.log('✗ Registration failed:', registerRes.data);
        throw new Error('Could not authenticate');
      }
    }

    // Step 2: Get all medicines
    console.log('Step 2: Fetching all medicines...');
    const medicinesRes = await request('GET', '/medicines?page=1&limit=10', null, token);
    console.log(`Status: ${medicinesRes.status}`);
    if (medicinesRes.status === 200) {
      console.log(`✓ Retrieved ${medicinesRes.data.medicines.length} medicines`);
      console.log(`  Total in database: ${medicinesRes.data.total}\n`);
    } else {
      console.log(`✗ Error:`, medicinesRes.data);
    }

    // Step 3: Get a specific medicine
    if (medicinesRes.data.medicines.length > 0) {
      const med = medicinesRes.data.medicines[0];
      console.log(`Step 3: Fetching medicine by ID (${med.id})...`);
      const getRes = await request('GET', `/medicines/${med.id}`, null, token);
      if (getRes.status === 200) {
        console.log(`✓ Retrieved: ${getRes.data.name}`);
        console.log(`  Category: ${getRes.data.category}`);
        console.log(`  Stock: ${getRes.data.initialQuantity} units\n`);
      } else {
        console.log(`✗ Error:`, getRes.data);
      }
    }

    // Step 4: Search medicines
    console.log('Step 4: Searching for Paracetamol...');
    const searchRes = await request('GET', '/medicines?search=Paracetamol&page=1&limit=10', null, token);
    if (searchRes.status === 200) {
      console.log(`✓ Found ${searchRes.data.medicines.length} results\n`);
    } else {
      console.log(`✗ Error:`, searchRes.data);
    }

    // Step 5: Filter by category
    console.log('Step 5: Filtering by category (Antibiotics)...');
    const filterRes = await request('GET', '/medicines?category=Antibiotics&page=1&limit=10', null, token);
    if (filterRes.status === 200) {
      console.log(`✓ Found ${filterRes.data.medicines.length} antibiotics\n`);
    } else {
      console.log(`✗ Error:`, filterRes.data);
    }

    // Step 6: Create new medicine
    console.log('Step 6: Creating new medicine...');
    const createRes = await request('POST', '/medicines', {
      name: 'Test Medicine ' + Date.now(),
      genericName: 'Test Generic',
      category: 'Analgesics',
      medicineType: 'OTC',
      medicineForm: 'tablet',
      purchasePrice: '5.0',
      sellingPrice: '8.0',
      initialQuantity: '100',
      dosage: '100mg',
    }, token);

    if (createRes.status === 201) {
      console.log(`✓ Created: ${createRes.data.name}`);
      const newMedId = createRes.data.id;

      // Step 7: Update medicine
      console.log(`\nStep 7: Updating medicine...`);
      const updateRes = await request('PUT', `/medicines/${newMedId}`, {
        initialQuantity: 500,
        sellingPrice: '10.0',
      }, token);

      if (updateRes.status === 200) {
        console.log(`✓ Updated: Stock=${updateRes.data.initialQuantity}, Price=$${updateRes.data.sellingPrice}\n`);
      } else {
        console.log(`✗ Error:`, updateRes.data);
      }

      // Step 8: Delete medicine
      console.log('Step 8: Deleting medicine...');
      const deleteRes = await request('DELETE', `/medicines/${newMedId}`, null, token);
      if (deleteRes.status === 200) {
        console.log(`✓ Deleted successfully\n`);
      } else {
        console.log(`✗ Error:`, deleteRes.data);
      }
    } else {
      console.log(`✗ Error:`, createRes.data);
    }

    console.log('=== All Tests Completed ===');
  } catch (err) {
    console.error('Test Error:', err.message);
  }
}

test();
