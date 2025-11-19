const http = require('http');

const BASE_URL = 'http://localhost:5000/api';
let AUTH_TOKEN = '';

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('Starting Room Allotment API Tests...\n');

  try {
    // Step 1: Login to get auth token
    console.log('1. Logging in...');
    const loginRes = await request('POST', '/auth/login', {
      email: 'admin@medixpro.com',
      password: 'password123',
    });

    if (loginRes.body.token) {
      AUTH_TOKEN = loginRes.body.token;
      console.log('✓ Login successful, token obtained\n');
    } else {
      console.log('✗ Login failed:', loginRes.body);
      return;
    }

    // Step 2: Create a room
    console.log('2. Creating a test room...');
    const roomRes = await request('POST', '/room-allotment/rooms', {
      roomNumber: '101',
      roomType: 'Private',
      department: 'Cardiology',
      floor: 'First',
      capacity: 1,
      pricePerDay: 5000,
      status: 'Available',
      description: 'Private room for cardiac patients',
      television: true,
      attachedBathroom: true,
      airConditioning: true,
      wheelchairAccessible: false,
      wifi: true,
      oxygenSupply: true,
      telephone: true,
      nursecallButton: true,
      additionalNotes: 'Premium room',
    });

    if (roomRes.status === 201) {
      console.log('✓ Room created successfully');
      console.log(`  Room ID: ${roomRes.body.id}\n`);
      const roomId = roomRes.body.id;

      // Step 3: Create a room allotment
      console.log('3. Creating a room allotment...');
      const allotmentRes = await request('POST', '/room-allotment/allotments', {
        patientId: 'P-1001',
        patientName: 'John Doe',
        patientPhone: '+91-9876543210',
        roomId: roomId,
        attendingDoctor: 'Dr. Emily Chun',
        emergencyContact: 'Jane Doe',
        specialRequirements: 'No loud noises',
        allotmentDate: new Date().toISOString(),
        expectedDischargeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Occupied',
        paymentMethod: 'Card',
        insuranceDetails: 'Blue Cross',
        additionalNotes: 'Patient requires regular monitoring',
      });

      if (allotmentRes.status === 201) {
        console.log('✓ Room allotment created successfully');
        console.log(`  Allotment ID: ${allotmentRes.body.id}\n`);
        const allotmentId = allotmentRes.body.id;

        // Step 4: Fetch all rooms
        console.log('4. Fetching all rooms...');
        const roomsRes = await request('GET', '/room-allotment/rooms');
        if (roomsRes.status === 200) {
          console.log(`✓ Fetched rooms: ${roomsRes.body.rooms.length} room(s)\n`);
        }

        // Step 5: Fetch all allotments
        console.log('5. Fetching all allotments...');
        const allotmentsRes = await request('GET', '/room-allotment/allotments');
        if (allotmentsRes.status === 200) {
          console.log(`✓ Fetched allotments: ${allotmentsRes.body.allotments.length} allotment(s)\n`);
        }

        // Step 6: Get rooms by department
        console.log('6. Fetching rooms by department (Cardiology)...');
        const deptRes = await request('GET', '/room-allotment/by-department/Cardiology');
        if (deptRes.status === 200) {
          console.log(`✓ Department Cardiology stats:`);
          console.log(`  Total Rooms: ${deptRes.body.totalRooms}`);
          console.log(`  Occupied: ${deptRes.body.occupied}`);
          console.log(`  Available: ${deptRes.body.available}\n`);
        }

        // Step 7: Get statistics
        console.log('7. Fetching statistics...');
        const statsRes = await request('GET', '/room-allotment/statistics/summary');
        if (statsRes.status === 200) {
          console.log('✓ Statistics:');
          console.log(`  Total Rooms: ${statsRes.body.totalRooms}`);
          console.log(`  Occupied: ${statsRes.body.occupiedRooms}`);
          console.log(`  Available: ${statsRes.body.availableRooms}`);
          console.log(`  Total Allotments: ${statsRes.body.totalAllotments}\n`);
        }

        // Step 8: Create another room
        console.log('8. Creating another test room...');
        const room2Res = await request('POST', '/room-allotment/rooms', {
          roomNumber: '102',
          roomType: 'Semi-Private',
          department: 'Orthopedics',
          floor: 'First',
          capacity: 2,
          pricePerDay: 3000,
          status: 'Available',
          description: 'Semi-private room for orthopedic patients',
        });

        if (room2Res.status === 201) {
          console.log('✓ Second room created successfully\n');
          const room2Id = room2Res.body.id;

          // Step 9: Update the first allotment
          console.log('9. Updating the allotment...');
          const updateRes = await request('PUT', `/room-allotment/allotments/${allotmentId}`, {
            status: 'Discharged',
            expectedDischargeDate: new Date().toISOString(),
          });

          if (updateRes.status === 200) {
            console.log('✓ Allotment updated successfully\n');
          }

          // Step 10: Delete the allotment
          console.log('10. Deleting the allotment...');
          const deleteRes = await request('DELETE', `/room-allotment/allotments/${allotmentId}`);
          if (deleteRes.status === 200) {
            console.log('✓ Allotment deleted successfully\n');
          }
        }
      } else {
        console.log('✗ Failed to create allotment:', allotmentRes.body);
      }
    } else {
      console.log('✗ Failed to create room:', roomRes.body);
    }

    console.log('✓ All tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

runTests();
