const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

let authToken = '';
let bloodStockId = '';
let donorId = '';
let issueId = '';

async function login() {
  try {
    console.log('\n=== Testing Login ===');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@hospital.com',
      password: 'admin123'
    });
    authToken = response.data.token;
    console.log('✓ Login successful');
    console.log(`Token: ${authToken.substring(0, 20)}...`);
  } catch (error) {
    console.error('✗ Login failed:', error.response?.data?.error || error.message);
    throw error;
  }
}

async function testBloodStockEndpoints() {
  const headers = { Authorization: `Bearer ${authToken}` };

  try {
    console.log('\n=== Testing Blood Stock GET ===');
    const getResponse = await axios.get(`${API_URL}/blood-bank/blood-stock`, { headers });
    console.log('✓ GET /blood-bank/blood-stock successful');
    console.log(`  - Found ${getResponse.data.data.length} blood units`);
    console.log(`  - Blood types: ${Object.keys(getResponse.data.stats).join(', ')}`);
    
    console.log('\n=== Testing Blood Stock POST ===');
    const postResponse = await axios.post(
      `${API_URL}/blood-bank/blood-stock`,
      {
        bloodType: 'O+',
        quantity: 5,
        collectionDate: new Date().toISOString(),
        status: 'available',
        donorId: null
      },
      { headers }
    );
    bloodStockId = postResponse.data.data.id;
    console.log('✓ POST /blood-bank/blood-stock successful');
    console.log(`  - Created unit ID: ${bloodStockId}`);

    console.log('\n=== Testing Blood Stock PUT ===');
    const putResponse = await axios.put(
      `${API_URL}/blood-bank/blood-stock/${bloodStockId}`,
      {
        status: 'available',
        quantity: 10,
        notes: 'Test update'
      },
      { headers }
    );
    console.log('✓ PUT /blood-bank/blood-stock/:id successful');
    console.log(`  - Updated quantity to: ${putResponse.data.data.quantity}`);

  } catch (error) {
    console.error('✗ Blood stock test failed:', error.response?.data || error.message);
  }
}

async function testBloodDonorsEndpoints() {
  const headers = { Authorization: `Bearer ${authToken}` };

  try {
    console.log('\n=== Testing Blood Donors GET ===');
    const getResponse = await axios.get(`${API_URL}/blood-bank/blood-donors`, { headers });
    console.log('✓ GET /blood-bank/blood-donors successful');
    console.log(`  - Found ${getResponse.data.data.length} donors`);

    console.log('\n=== Testing Blood Donors POST ===');
    const postResponse = await axios.post(
      `${API_URL}/blood-bank/blood-donors`,
      {
        donorId: `DONOR-${Date.now()}`,
        bloodType: 'AB+',
        quantity: 1,
        collectionDate: new Date().toISOString()
      },
      { headers }
    );
    donorId = postResponse.data.data?.donorId;
    console.log('✓ POST /blood-bank/blood-donors successful');
    console.log(`  - Created donor record: ${donorId}`);

  } catch (error) {
    console.error('✗ Blood donors test failed:', error.response?.data || error.message);
  }
}

async function testBloodIssuesEndpoints() {
  const headers = { Authorization: `Bearer ${authToken}` };

  try {
    console.log('\n=== Testing Blood Issues GET ===');
    const getResponse = await axios.get(`${API_URL}/blood-bank/blood-issues`, { headers });
    console.log('✓ GET /blood-bank/blood-issues successful');
    console.log(`  - Found ${getResponse.data.data.length} issued records`);

    console.log('\n=== Testing Blood Issues POST ===');
    const postResponse = await axios.post(
      `${API_URL}/blood-bank/blood-issues`,
      {
        bloodType: 'O+',
        quantity: 2,
        patientId: 'PAT-001',
        issuedTo: 'Dr. Smith'
      },
      { headers }
    );
    issueId = postResponse.data.data?.id;
    console.log('✓ POST /blood-bank/blood-issues successful');
    console.log(`  - Created issue ID: ${issueId}`);

    if (issueId) {
      console.log('\n=== Testing Blood Issues PUT ===');
      const putResponse = await axios.put(
        `${API_URL}/blood-bank/blood-issues/${issueId}`,
        {
          status: 'issued',
          quantity: 2
        },
        { headers }
      );
      console.log('✓ PUT /blood-bank/blood-issues/:id successful');
    }

  } catch (error) {
    console.error('✗ Blood issues test failed:', error.response?.data || error.message);
  }
}

async function testDeleteEndpoints() {
  const headers = { Authorization: `Bearer ${authToken}` };

  try {
    if (bloodStockId) {
      console.log('\n=== Testing Blood Stock DELETE ===');
      await axios.delete(`${API_URL}/blood-bank/blood-stock/${bloodStockId}`, { headers });
      console.log('✓ DELETE /blood-bank/blood-stock/:id successful');
    }

    if (issueId) {
      console.log('\n=== Testing Blood Issues DELETE ===');
      await axios.delete(`${API_URL}/blood-bank/blood-issues/${issueId}`, { headers });
      console.log('✓ DELETE /blood-bank/blood-issues/:id successful');
    }
  } catch (error) {
    console.error('✗ Delete test failed:', error.response?.data || error.message);
  }
}

async function testAuthorizationFail() {
  try {
    console.log('\n=== Testing 401 Unauthorized (no token) ===');
    await axios.get(`${API_URL}/blood-bank/blood-stock`);
    console.log('✗ Should have failed without token');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✓ Correctly returned 401 Unauthorized');
    } else {
      console.error('✗ Unexpected error:', error.message);
    }
  }
}

async function runAllTests() {
  try {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         Blood Bank API Complete Test Suite                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    await testAuthorizationFail();
    await login();
    await testBloodStockEndpoints();
    await testBloodDonorsEndpoints();
    await testBloodIssuesEndpoints();
    await testDeleteEndpoints();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    ✓ All Tests Completed                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n✗ Test suite failed:', error.message);
    process.exit(1);
  }
}

runAllTests();
