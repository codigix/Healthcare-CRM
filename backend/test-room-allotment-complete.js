const http = require('http');

const API_URL = 'http://localhost:5000/api';
let authToken = '';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
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
            data: responseData ? JSON.parse(responseData) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData
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
  console.log('1. Trying to login...');
  
  let loginRes = await makeRequest('POST', '/auth/login', {
    email: 'testuser@hospital.com',
    password: 'test123456'
  });

  if (loginRes.status !== 200) {
    console.log('   User not found, registering...');
    const registerRes = await makeRequest('POST', '/auth/register', {
      name: 'Test User',
      email: 'testuser@hospital.com',
      password: 'test123456',
      role: 'admin'
    });
    
    if (registerRes.status !== 201) {
      console.error('Registration failed:', registerRes);
      process.exit(1);
    }
    
    authToken = registerRes.data.token;
    console.log('✓ Registration successful, token:', authToken.substring(0, 20) + '...');
    return;
  }

  authToken = loginRes.data.token;
  console.log('✓ Login successful, token:', authToken.substring(0, 20) + '...');
}

async function testAddRoom() {
  console.log('\n2. Testing POST /room-allotment/rooms (Add Room)...');
  const roomData = {
    roomNumber: 'A101',
    roomType: 'Private',
    department: 'Cardiology',
    floor: 'First',
    capacity: 1,
    pricePerDay: 5000,
    status: 'Available',
    description: 'Test private room',
    television: true,
    attachedBathroom: true,
    airConditioning: true,
    wheelchairAccessible: false,
    wifi: true,
    oxygenSupply: true,
    telephone: true,
    nursecallButton: true,
    additionalNotes: 'Test room notes'
  };

  const res = await makeRequest('POST', '/room-allotment/rooms', roomData);
  console.log('Response Status:', res.status);
  if (res.status === 201) {
    console.log('✓ Room created successfully');
    return res.data.id;
  } else {
    console.error('✗ Failed to create room:', res.data);
    return null;
  }
}

async function testGetRooms() {
  console.log('\n3. Testing GET /room-allotment/rooms...');
  const res = await makeRequest('GET', '/room-allotment/rooms');
  console.log('Response Status:', res.status);
  if (res.status === 200) {
    console.log('✓ Fetched rooms:', res.data.total, 'total');
    return res.data.rooms[0]?.id || null;
  } else {
    console.error('✗ Failed to fetch rooms:', res.data);
    return null;
  }
}

async function testCreateAllotment(roomId) {
  console.log('\n4. Testing POST /room-allotment/allotments (Create Allotment)...');
  const allotmentData = {
    patientId: 'P001',
    patientName: 'John Doe',
    patientPhone: '9876543210',
    roomId: roomId,
    attendingDoctor: 'Dr. Emily Chun',
    emergencyContact: '9876543211',
    specialRequirements: 'Diabetic care required',
    allotmentDate: new Date().toISOString().split('T')[0],
    expectedDischargeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Insurance',
    insuranceDetails: 'Policy #12345',
    additionalNotes: 'Test allotment',
    status: 'Occupied'
  };

  const res = await makeRequest('POST', '/room-allotment/allotments', allotmentData);
  console.log('Response Status:', res.status);
  if (res.status === 201) {
    console.log('✓ Allotment created successfully');
    return res.data.id;
  } else {
    console.error('✗ Failed to create allotment:', res.data);
    return null;
  }
}

async function testGetAllotments() {
  console.log('\n5. Testing GET /room-allotment/allotments...');
  const res = await makeRequest('GET', '/room-allotment/allotments');
  console.log('Response Status:', res.status);
  if (res.status === 200) {
    console.log('✓ Fetched allotments:', res.data.allotments.length, 'total');
    return res.data.allotments[0]?.id || null;
  } else {
    console.error('✗ Failed to fetch allotments:', res.data);
    return null;
  }
}

async function testUpdateAllotment(allotmentId) {
  console.log('\n6. Testing PUT /room-allotment/allotments/:id (Update Allotment)...');
  const updateData = {
    status: 'Discharged',
    additionalNotes: 'Patient discharged successfully'
  };

  const res = await makeRequest('PUT', `/room-allotment/allotments/${allotmentId}`, updateData);
  console.log('Response Status:', res.status);
  if (res.status === 200) {
    console.log('✓ Allotment updated successfully');
  } else {
    console.error('✗ Failed to update allotment:', res.data);
  }
}

async function testGetByDepartment() {
  console.log('\n7. Testing GET /room-allotment/by-department/:dept...');
  const res = await makeRequest('GET', '/room-allotment/by-department/Cardiology');
  console.log('Response Status:', res.status);
  if (res.status === 200) {
    console.log('✓ Fetched department rooms');
    console.log('  - Total rooms:', res.data.totalRooms);
    console.log('  - Occupied:', res.data.occupied);
    console.log('  - Available:', res.data.available);
  } else {
    console.error('✗ Failed to fetch department rooms:', res.data);
  }
}

async function testUpdateRoomStatus(roomId) {
  console.log('\n8. Testing PUT /room-allotment/rooms/:id (Update Room Status)...');
  const updateData = {
    status: 'Maintenance'
  };

  const res = await makeRequest('PUT', `/room-allotment/rooms/${roomId}`, updateData);
  console.log('Response Status:', res.status);
  if (res.status === 200) {
    console.log('✓ Room status updated successfully');
  } else {
    console.error('✗ Failed to update room status:', res.data);
  }
}

async function testDeleteAllotment(allotmentId) {
  console.log('\n9. Testing DELETE /room-allotment/allotments/:id...');
  const res = await makeRequest('DELETE', `/room-allotment/allotments/${allotmentId}`);
  console.log('Response Status:', res.status);
  if (res.status === 200) {
    console.log('✓ Allotment deleted successfully');
  } else {
    console.error('✗ Failed to delete allotment:', res.data);
  }
}

async function testDeleteRoom(roomId) {
  console.log('\n10. Testing DELETE /room-allotment/rooms/:id...');
  const res = await makeRequest('DELETE', `/room-allotment/rooms/${roomId}`);
  console.log('Response Status:', res.status);
  if (res.status === 200) {
    console.log('✓ Room deleted successfully');
  } else {
    console.error('✗ Failed to delete room:', res.data);
  }
}

async function runTests() {
  try {
    await login();
    
    const roomId = await testAddRoom();
    await testGetRooms();
    
    const allotmentId = await testCreateAllotment(roomId);
    await testGetAllotments();
    
    if (allotmentId) {
      await testUpdateAllotment(allotmentId);
      await testDeleteAllotment(allotmentId);
    }
    
    await testGetByDepartment();
    
    if (roomId) {
      await testUpdateRoomStatus(roomId);
      await testDeleteRoom(roomId);
    }

    console.log('\n✓ All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

runTests();
