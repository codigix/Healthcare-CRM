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

async function runTest() {
  try {
    const loginRes = await request('POST', '/auth/login', {
      email: 'admin@medixpro.com',
      password: 'password123',
    });

    if (loginRes.body.token) {
      AUTH_TOKEN = loginRes.body.token;
      console.log('✓ Login successful\n');
    } else {
      console.log('✗ Login failed');
      return;
    }

    console.log('Fetching rooms by department (Cardiology)...\n');
    const deptRes = await request('GET', '/room-allotment/by-department/Cardiology');
    
    if (deptRes.status === 200) {
      console.log('Department:', deptRes.body.department);
      console.log('Total Rooms:', deptRes.body.totalRooms);
      console.log('Occupied:', deptRes.body.occupied);
      console.log('Available:', deptRes.body.available);
      console.log('\nRooms data:');
      console.log(JSON.stringify(deptRes.body.rooms, null, 2));
    } else {
      console.log('Error:', deptRes.body);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

runTest();
