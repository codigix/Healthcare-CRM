const http = require('http');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000';
const BASE_URL = `${API_URL}/api`;
let token = null;

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            body: body ? JSON.parse(body) : null,
          };
          resolve(response);
        } catch (e) {
          resolve({
            status: res.statusCode,
            body,
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function login() {
  console.log('Logging in...');
  const response = await makeRequest('POST', '/auth/login', {
    email: 'admin@medixpro.com',
    password: 'password123',
  });
  
  if (response.status === 200 && response.body.token) {
    token = response.body.token;
    console.log('✓ Login successful');
    return true;
  } else {
    console.log('✗ Login failed:', response.body);
    return false;
  }
}

async function testMedicinesAPI() {
  console.log('\n=== Testing Medicines API ===\n');

  // Test 1: Create a medicine
  console.log('1. Testing CREATE medicine...');
  const testMedicineName = `Test Medicine ${Date.now()}`;
  const createResponse = await makeRequest('POST', '/medicines', {
    name: testMedicineName,
    genericName: 'Test Generic',
    category: 'Test Category',
    medicineType: 'Prescription',
    medicineForm: 'tablet',
    purchasePrice: 10.5,
    sellingPrice: 15.0,
    taxRate: 5,
    initialQuantity: 1000,
    reorderLevel: 100,
    maximumLevel: 5000,
    manufacturer: 'Test Manufacturer',
    supplier: 'Test Supplier',
    dosage: '500mg',
    description: 'Test medicine for testing',
  });

  if (createResponse.status === 201) {
    console.log('✓ Medicine created successfully');
    const medicineId = createResponse.body.id;

    // Test 2: Get medicine by ID
    console.log('\n2. Testing GET medicine by ID...');
    const getResponse = await makeRequest('GET', `/medicines/${medicineId}`);
    if (getResponse.status === 200) {
      console.log('✓ Medicine retrieved successfully');
    } else {
      console.log('✗ Failed to retrieve medicine:', getResponse.body);
    }

    // Test 3: List medicines
    console.log('\n3. Testing LIST medicines...');
    const listResponse = await makeRequest('GET', '/medicines?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log(`✓ Listed medicines (total: ${listResponse.body.total})`);
    } else {
      console.log('✗ Failed to list medicines:', listResponse.body);
    }

    // Test 4: Update medicine
    console.log('\n4. Testing UPDATE medicine...');
    const updateResponse = await makeRequest('PUT', `/medicines/${medicineId}`, {
      initialQuantity: 2000,
      sellingPrice: 18.0,
    });

    if (updateResponse.status === 200) {
      console.log('✓ Medicine updated successfully');
    } else {
      console.log('✗ Failed to update medicine:', updateResponse.body);
    }

    // Test 5: Search medicines
    console.log('\n5. Testing SEARCH medicines...');
    const searchResponse = await makeRequest('GET', '/medicines?search=Amoxicillin&page=1&limit=10');
    if (searchResponse.status === 200 && searchResponse.body.medicines.length > 0) {
      console.log('✓ Search successful');
    } else {
      console.log('✗ Search failed');
    }

    // Test 6: Filter by category
    console.log('\n6. Testing FILTER by category...');
    const filterResponse = await makeRequest('GET', '/medicines?category=Antibiotics&page=1&limit=10');
    if (filterResponse.status === 200) {
      console.log(`✓ Filtered medicines (${filterResponse.body.medicines.length} found)`);
    } else {
      console.log('✗ Filter failed');
    }

    // Test 7: Delete medicine
    console.log('\n7. Testing DELETE medicine...');
    const deleteResponse = await makeRequest('DELETE', `/medicines/${medicineId}`);
    if (deleteResponse.status === 200) {
      console.log('✓ Medicine deleted successfully');
    } else {
      console.log('✗ Failed to delete medicine:', deleteResponse.body);
    }

    console.log('\n=== All tests completed ===\n');
  } else {
    console.log('✗ Failed to create medicine:', createResponse.body);
  }
}

async function runTests() {
  try {
    if (await login()) {
      await testMedicinesAPI();
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

runTests();
