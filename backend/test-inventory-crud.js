const http = require('http');

const BASE_URL = 'http://localhost:5000/api';
let token = null;
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
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

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    results.passed++;
    results.tests.push({ name, status: 'PASSED' });
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'FAILED', error: error.message });
  }
}

async function login() {
  console.log('\n🔐 Authenticating...\n');
  const response = await makeRequest('POST', '/auth/login', {
    email: 'admin@medixpro.com',
    password: 'password123',
  });

  if (response.status === 200 && response.body.token) {
    token = response.body.token;
    console.log('✅ Login successful\n');
    return true;
  } else {
    console.log('❌ Login failed\n');
    return false;
  }
}

let createdAlertId = null;
let createdSupplierId = null;

async function testInventoryAPIs() {
  console.log('\n📋 TESTING INVENTORY ALERTS & SUPPLIERS\n');

  console.log('=== INVENTORY ALERTS TESTS ===\n');

  await test('Fetch all inventory alerts', async () => {
    const res = await makeRequest('GET', '/inventory-alerts?page=1&limit=10');
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (!res.body.alerts || !Array.isArray(res.body.alerts)) throw new Error('No alerts array');
    if (res.body.total === undefined) throw new Error('No total count');
  });

  await test('Create new inventory alert', async () => {
    const res = await makeRequest('POST', '/inventory-alerts', {
      medicineId: 'TEST001',
      name: 'Test Medicine Alert',
      category: 'Test Category',
      currentStock: 5,
      minLevel: 10,
      status: 'Low Stock',
      supplier: 'Test Supplier',
    });
    if (res.status !== 201) throw new Error(`Status: ${res.status}`);
    if (!res.body.id) throw new Error('No alert ID returned');
    createdAlertId = res.body.id;
  });

  await test('Fetch single inventory alert', async () => {
    if (!createdAlertId) throw new Error('No alert ID to fetch');
    const res = await makeRequest('GET', `/inventory-alerts/${createdAlertId}`);
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (res.body.id !== createdAlertId) throw new Error('Wrong alert returned');
  });

  await test('Update inventory alert', async () => {
    if (!createdAlertId) throw new Error('No alert ID to update');
    const res = await makeRequest('PUT', `/inventory-alerts/${createdAlertId}`, {
      currentStock: 8,
      minLevel: 12,
      status: 'Out of Stock',
    });
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (res.body.currentStock !== 8) throw new Error('Stock not updated');
  });

  await test('Search inventory alerts', async () => {
    const res = await makeRequest('GET', '/inventory-alerts?search=Test&page=1&limit=10');
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (!Array.isArray(res.body.alerts)) throw new Error('Not an array');
  });

  await test('Delete inventory alert', async () => {
    if (!createdAlertId) throw new Error('No alert ID to delete');
    const res = await makeRequest('DELETE', `/inventory-alerts/${createdAlertId}`);
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
  });

  console.log('\n=== SUPPLIERS TESTS ===\n');

  await test('Fetch all suppliers', async () => {
    const res = await makeRequest('GET', '/suppliers?page=1&limit=10');
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (!res.body.suppliers || !Array.isArray(res.body.suppliers)) throw new Error('No suppliers array');
    if (res.body.total === undefined) throw new Error('No total count');
  });

  await test('Create new supplier', async () => {
    const res = await makeRequest('POST', '/suppliers', {
      name: 'Test Supplier Inc.',
      category: 'Test Category',
      contact: 'John Doe',
      email: 'test@supplier.com',
      phone: '123-456-7890',
      location: 'Test City',
      rating: 4,
      status: 'Active',
    });
    if (res.status !== 201) throw new Error(`Status: ${res.status}`);
    if (!res.body.id) throw new Error('No supplier ID returned');
    createdSupplierId = res.body.id;
  });

  await test('Fetch single supplier', async () => {
    if (!createdSupplierId) throw new Error('No supplier ID to fetch');
    const res = await makeRequest('GET', `/suppliers/${createdSupplierId}`);
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (res.body.id !== createdSupplierId) throw new Error('Wrong supplier returned');
  });

  await test('Update supplier', async () => {
    if (!createdSupplierId) throw new Error('No supplier ID to update');
    const res = await makeRequest('PUT', `/suppliers/${createdSupplierId}`, {
      phone: '987-654-3210',
      rating: 5,
    });
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (res.body.rating !== 5) throw new Error('Rating not updated');
  });

  await test('Search suppliers', async () => {
    const res = await makeRequest('GET', '/suppliers?search=Test&page=1&limit=10');
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (!Array.isArray(res.body.suppliers)) throw new Error('Not an array');
  });

  await test('Filter suppliers by category', async () => {
    const res = await makeRequest('GET', '/suppliers?category=Medications&page=1&limit=10');
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
  });

  await test('Delete supplier', async () => {
    if (!createdSupplierId) throw new Error('No supplier ID to delete');
    const res = await makeRequest('DELETE', `/suppliers/${createdSupplierId}`);
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
  });

  console.log('\n=== DATA VALIDATION TESTS ===\n');

  await test('Verify seeded alerts exist', async () => {
    const res = await makeRequest('GET', '/inventory-alerts?page=1&limit=100');
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (res.body.total < 8) throw new Error(`Expected at least 8 alerts, got ${res.body.total}`);
  });

  await test('Verify seeded suppliers exist', async () => {
    const res = await makeRequest('GET', '/suppliers?page=1&limit=100');
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    if (res.body.total < 7) throw new Error(`Expected at least 7 suppliers, got ${res.body.total}`);
  });

  await test('Verify alert status filter works', async () => {
    const res = await makeRequest('GET', '/inventory-alerts?status=Low%20Stock&page=1&limit=100');
    if (res.status !== 200) throw new Error(`Status: ${res.status}`);
    const allLowStock = res.body.alerts.every(a => a.status === 'Low Stock');
    if (!allLowStock) throw new Error('Status filter not working correctly');
  });
}

async function runTests() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║     INVENTORY MANAGEMENT - CRUD OPERATIONS TEST SUITE          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    if (await login()) {
      await testInventoryAPIs();
    } else {
      console.error('Cannot proceed without authentication');
      process.exit(1);
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                        TEST SUMMARY                             ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log(`✅ PASSED: ${results.passed}`);
    console.log(`❌ FAILED: ${results.failed}`);
    console.log(`📊 TOTAL:  ${results.passed + results.failed}\n`);

    if (results.failed === 0) {
      console.log('🎉 ALL TESTS PASSED! Inventory management working perfectly!\n');
      console.log('✨ Features Verified:');
      console.log('   ✓ Inventory Alerts CRUD operations');
      console.log('   ✓ Suppliers CRUD operations');
      console.log('   ✓ Search and filtering functionality');
      console.log('   ✓ Database persistence');
      console.log('   ✓ API authentication\n');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.\n');
    }

    process.exit(results.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

runTests();
