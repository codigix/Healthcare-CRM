const http = require('http');

async function testAPI() {
  try {
    const loginBody = JSON.stringify({
      email: 'admin@medixpro.com',
      password: 'password123'
    });

    await new Promise((resolve, reject) => {
      const loginReq = http.request('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginBody.length
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const loginResponse = JSON.parse(data);
          const token = loginResponse.token;

          const deptReq = http.request('http://localhost:5000/api/departments', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          }, (res) => {
            let deptData = '';
            res.on('data', chunk => deptData += chunk);
            res.on('end', () => {
              console.log('Departments API Response:');
              console.log(JSON.stringify(JSON.parse(deptData), null, 2));
              resolve();
            });
          });
          deptReq.on('error', reject);
          deptReq.end();
        });
      });
      loginReq.on('error', reject);
      loginReq.write(loginBody);
      loginReq.end();
    });

    console.log('\nStatistics API Response:');
    await new Promise((resolve, reject) => {
      const loginReq = http.request('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginBody.length
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const loginResponse = JSON.parse(data);
          const token = loginResponse.token;

          const statsReq = http.request('http://localhost:5000/api/departments/statistics/summary', {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          }, (res) => {
            let statsData = '';
            res.on('data', chunk => statsData += chunk);
            res.on('end', () => {
              console.log(JSON.stringify(JSON.parse(statsData), null, 2));
              resolve();
            });
          });
          statsReq.on('error', reject);
          statsReq.end();
        });
      });
      loginReq.on('error', reject);
      loginReq.write(loginBody);
      loginReq.end();
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
