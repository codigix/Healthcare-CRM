const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

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

async function testCRUD() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║        BLOOD BANK MODULE - COMPREHENSIVE CRUD TEST             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  let passCount = 0;
  let failCount = 0;

  // Test 1: CREATE Blood Donor
  console.log('📝 TEST 1: CREATE Blood Donor');
  try {
    const donorData = {
      name: 'Test Donor ' + Date.now(),
      bloodType: 'A+',
      contact: '555-' + Math.random().toString().slice(2, 7),
      email: 'donor' + Date.now() + '@test.com',
      dateOfBirth: '1990-01-15',
      gender: 'Male',
      address: '123 Test St',
      city: 'Test City',
      phoneNumber: '555-1234'
    };

    const res = await makeRequest('POST', '/blood-bank/blood-donors', donorData);
    if (res.status === 201 && res.body.success) {
      console.log('✅ PASSED - Donor created successfully');
      console.log(`   Donor ID: ${res.body.data.id}\n`);
      passCount++;
    } else {
      console.log('❌ FAILED - Status: ' + res.status + '\n');
      failCount++;
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Test 2: READ Blood Donors
  console.log('📋 TEST 2: READ Blood Donors');
  try {
    const res = await makeRequest('GET', '/blood-bank/blood-donors');
    if (res.status === 200 && res.body.success && res.body.data.length > 0) {
      console.log('✅ PASSED - Donors retrieved successfully');
      console.log(`   Total donors: ${res.body.data.length}\n`);
      passCount++;
    } else {
      console.log('❌ FAILED - No donors found\n');
      failCount++;
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Test 3: CREATE Blood Unit
  console.log('🩸 TEST 3: CREATE Blood Unit');
  try {
    const unitData = {
      bloodType: 'O+',
      quantity: 2,
      screeningComplete: true,
      processingComplete: true,
      collectionDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sourceType: 'Voluntary',
      collectionLocation: 'Test Center',
      notes: 'Test unit'
    };

    const res = await makeRequest('POST', '/blood-bank/blood-stock', unitData);
    if (res.status === 201 && res.body.success) {
      console.log('✅ PASSED - Blood unit created successfully');
      console.log(`   Unit ID: ${res.body.data.unitId}\n`);
      passCount++;
    } else {
      console.log('❌ FAILED - Status: ' + res.status + '\n');
      failCount++;
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Test 4: READ Blood Stock
  console.log('📊 TEST 4: READ Blood Stock');
  try {
    const res = await makeRequest('GET', '/blood-bank/blood-stock');
    if (res.status === 200 && res.body.success && res.body.data.length > 0) {
      console.log('✅ PASSED - Blood stock retrieved successfully');
      console.log(`   Total units: ${res.body.total}`);
      console.log(`   Blood types available: ${Object.keys(res.body.stats).length}\n`);
      passCount++;
    } else {
      console.log('❌ FAILED - No blood units found\n');
      failCount++;
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Test 5: UPDATE Blood Unit
  console.log('✏️  TEST 5: UPDATE Blood Unit');
  try {
    const getRes = await makeRequest('GET', '/blood-bank/blood-stock');
    if (getRes.body.data.length > 0) {
      const unitId = getRes.body.data[0].id;
      const updateData = {
        quantity: 5,
        status: 'Available',
        notes: 'Updated test notes'
      };

      const res = await makeRequest('PUT', `/blood-bank/blood-stock/${unitId}`, updateData);
      if (res.status === 200 && res.body.success) {
        console.log('✅ PASSED - Blood unit updated successfully');
        console.log(`   Updated quantity: ${res.body.data.quantity}\n`);
        passCount++;
      } else {
        console.log('❌ FAILED - Status: ' + res.status + '\n');
        failCount++;
      }
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Test 6: CREATE Blood Issue
  console.log('🏥 TEST 6: CREATE Blood Issue');
  try {
    const issueData = {
      recipient: 'Test Patient',
      recipientId: 'P-TEST-' + Math.random().toString().slice(2, 6),
      bloodType: 'O+',
      units: 1,
      requestingDoctor: 'Dr. Test',
      purpose: 'Surgery',
      department: 'Surgery',
      notes: 'Test issue'
    };

    const res = await makeRequest('POST', '/blood-bank/blood-issues', issueData);
    if (res.status === 201 && res.body.success) {
      console.log('✅ PASSED - Blood issue created successfully');
      console.log(`   Issue ID: ${res.body.data.issueId}\n`);
      passCount++;
    } else {
      console.log('❌ FAILED - Status: ' + res.status + '\n');
      failCount++;
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Test 7: READ Blood Issues
  console.log('📋 TEST 7: READ Blood Issues');
  try {
    const res = await makeRequest('GET', '/blood-bank/blood-issues');
    if (res.status === 200 && res.body.success && res.body.data.length > 0) {
      console.log('✅ PASSED - Blood issues retrieved successfully');
      console.log(`   Total issues: ${res.body.data.length}\n`);
      passCount++;
    } else {
      console.log('❌ FAILED - No issues found\n');
      failCount++;
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Test 8: READ Blood Stock by Type
  console.log('🔍 TEST 8: READ Blood Stock by Type (A+)');
  try {
    const res = await makeRequest('GET', '/blood-bank/blood-stock/by-type/A%2B');
    if (res.status === 200 && res.body.success) {
      console.log('✅ PASSED - Blood stock by type retrieved successfully');
      console.log(`   A+ units available: ${res.body.totalUnits}\n`);
      passCount++;
    } else {
      console.log('❌ FAILED - Status: ' + res.status + '\n');
      failCount++;
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Test 9: READ Statistics
  console.log('📈 TEST 9: READ Blood Bank Statistics');
  try {
    const res = await makeRequest('GET', '/blood-bank/stats');
    if (res.status === 200 && res.body.success) {
      console.log('✅ PASSED - Statistics retrieved successfully');
      console.log(`   Total units: ${res.body.stats.totalUnits}`);
      console.log(`   Total donors: ${res.body.stats.totalDonors}`);
      console.log(`   Total issues: ${res.body.stats.totalIssues}\n`);
      passCount++;
    } else {
      console.log('❌ FAILED - Status: ' + res.status + '\n');
      failCount++;
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Test 10: DELETE Blood Unit
  console.log('🗑️  TEST 10: DELETE Blood Unit');
  try {
    const getRes = await makeRequest('GET', '/blood-bank/blood-stock');
    if (getRes.body.data.length > 0) {
      const unitIdToDelete = getRes.body.data[0].id;
      const res = await makeRequest('DELETE', `/blood-bank/blood-stock/${unitIdToDelete}`);
      if (res.status === 200 && res.body.success) {
        console.log('✅ PASSED - Blood unit deleted successfully\n');
        passCount++;
      } else {
        console.log('❌ FAILED - Status: ' + res.status + '\n');
        failCount++;
      }
    }
  } catch (error) {
    console.log('❌ FAILED - ' + error.message + '\n');
    failCount++;
  }

  // Summary
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                        TEST SUMMARY                             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  console.log(`✅ PASSED: ${passCount}`);
  console.log(`❌ FAILED: ${failCount}`);
  console.log(`📊 TOTAL:  ${passCount + failCount}\n`);

  if (failCount === 0) {
    console.log('🎉 ALL CRUD OPERATIONS WORKING PERFECTLY!\n');
    console.log('✨ Summary:');
    console.log('   ✓ Blood Donors - CREATE, READ');
    console.log('   ✓ Blood Stock - CREATE, READ, UPDATE, DELETE');
    console.log('   ✓ Blood Issues - CREATE, READ');
    console.log('   ✓ Statistics - READ');
    console.log('   ✓ Filtering - Blood stock by type\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some operations failed. Please review the errors above.\n');
    process.exit(1);
  }
}

testCRUD().catch(error => {
  console.error('Test error:', error);
  process.exit(1);
});
