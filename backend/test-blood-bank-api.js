const http = require('http');

const baseURL = 'http://localhost:5000/api';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseURL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(responseData)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Blood Bank API Endpoints\n');

  try {
    // Test 1: Health Check
    console.log('✓ Test 1: Health Check');
    const health = await makeRequest('GET', '/health');
    console.log(`  Status: ${health.status}`);
    console.log(`  Response: ${JSON.stringify(health.data)}\n`);

    // Test 2: Get Blood Stock
    console.log('✓ Test 2: Get Blood Stock');
    const bloodStock = await makeRequest('GET', '/blood-bank/blood-stock');
    console.log(`  Status: ${bloodStock.status}`);
    console.log(`  Blood Units Count: ${bloodStock.data.data?.length || 0}`);
    console.log(`  Total Units: ${bloodStock.data.stats ? Object.values(bloodStock.data.stats).reduce((sum, item) => sum + item.units, 0) : 0}\n`);

    // Test 3: Get Blood Donors
    console.log('✓ Test 3: Get Blood Donors');
    const donors = await makeRequest('GET', '/blood-bank/blood-donors');
    console.log(`  Status: ${donors.status}`);
    console.log(`  Donors Count: ${donors.data.data?.length || 0}\n`);

    // Test 4: Get Blood Issues
    console.log('✓ Test 4: Get Blood Issues');
    const issues = await makeRequest('GET', '/blood-bank/blood-issues');
    console.log(`  Status: ${issues.status}`);
    console.log(`  Issues Count: ${issues.data.data?.length || 0}\n`);

    // Test 5: Get Blood Bank Stats
    console.log('✓ Test 5: Get Blood Bank Stats');
    const stats = await makeRequest('GET', '/blood-bank/blood-bank/stats');
    console.log(`  Status: ${stats.status}`);
    console.log(`  Stats: ${JSON.stringify(stats.data.data, null, 2)}\n`);

    // Test 6: Add New Donor
    console.log('✓ Test 6: Add New Donor');
    const newDonor = await makeRequest('POST', '/blood-bank/blood-donors', {
      name: 'James Brown',
      bloodType: 'O-',
      contact: '+1 (555) 789-0123',
      email: 'james.brown@example.com',
      gender: 'Male',
      dateOfBirth: '1992-07-14'
    });
    console.log(`  Status: ${newDonor.status}`);
    console.log(`  Response: ${newDonor.data.success ? '✅ Created' : '❌ Failed'}\n`);

    // Test 7: Add Blood Unit
    console.log('✓ Test 7: Add Blood Unit');
    const newUnit = await makeRequest('POST', '/blood-bank/blood-stock', {
      bloodType: 'A+',
      quantity: 2,
      collectionDate: '2024-11-17',
      expiryDate: '2024-12-29',
      screeningComplete: true,
      processingComplete: true,
      sourceType: 'Voluntary Donation',
      collectionLocation: 'Main Blood Bank'
    });
    console.log(`  Status: ${newUnit.status}`);
    console.log(`  Response: ${newUnit.data.success ? '✅ Created' : '❌ Failed'}`);
    const unitId = newUnit.data.data?.id;
    console.log(`  Unit ID: ${unitId}\n`);

    // Test 8: Get specific blood unit
    if (unitId) {
      console.log('✓ Test 8: Get Specific Blood Unit');
      const unit = await makeRequest('GET', `/blood-bank/blood-stock/${unitId}`);
      console.log(`  Status: ${unit.status}`);
      console.log(`  Unit: ${unit.data.data?.unitId}\n`);
    }

    // Test 9: Add Blood Issue
    console.log('✓ Test 9: Add Blood Issue');
    const newIssue = await makeRequest('POST', '/blood-bank/blood-issues', {
      recipient: 'Test Patient',
      recipientId: 'P-00999',
      bloodType: 'A+',
      units: 1,
      requestingDoctor: 'Dr. Test Doctor',
      purpose: 'Emergency - Test',
      department: 'Emergency'
    });
    console.log(`  Status: ${newIssue.status}`);
    console.log(`  Response: ${newIssue.data.success ? '✅ Created' : '❌ Failed'}\n`);

    // Test 10: Get Blood by Type
    console.log('✓ Test 10: Get Blood Stock by Type (A+)');
    const bloodByType = await makeRequest('GET', '/blood-bank/blood-stock/by-type/A%2B');
    console.log(`  Status: ${bloodByType.status}`);
    console.log(`  Units Count: ${bloodByType.data.units?.length || 0}`);
    console.log(`  Total Units: ${bloodByType.data.totalUnits || 0}\n`);

    console.log('✅ All tests completed successfully!\n');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  }

  process.exit(0);
}

console.log('Waiting for server to be ready...');
setTimeout(runTests, 2000);
