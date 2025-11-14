const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtaHltam5xMjAwMDB1bXF3YW9mYmRvbGwiLCJlbWFpbCI6ImFkbWluQG1lZGl4cHJvLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MzExMDcwNiwiZXhwIjoxNzYzNzE1NTA2fQ.jmvY_A3nW2dq2ZBgLEdZHtaeLhgq0-_q0ikd-noU5Jc';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/departments/doctors/list',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const req = http.request(options, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (res.statusCode === 200) {
      console.log('Doctors:', JSON.stringify(JSON.parse(body), null, 2));
    } else {
      console.log('Response:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();
