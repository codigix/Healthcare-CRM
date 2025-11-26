const http = require('http');

function makeRequest(options, body = null) {
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', (e) => {
      console.error(`Error: ${e.message}`);
      resolve({ status: 0, body: '' });
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function testFlow() {
  console.log('Step 1: Login to get valid token...\n');
  
  const loginResult = await makeRequest({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'testuser@hospital.com', password: 'test' });

  console.log('Login Status:', loginResult.status);
  let token;
  try {
    const loginData = JSON.parse(loginResult.body);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    token = loginData.token;
  } catch (e) {
    console.error('Failed to parse login response');
    return;
  }

  console.log('\n\nStep 2: Test patient search with valid token...\n');
  
  const searches = ['sejal', 'abhijit', 'kale'];
  for (const searchTerm of searches) {
    const searchResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/patients/search?name=${encodeURIComponent(searchTerm)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`\n🔍 Searching for: "${searchTerm}"`);
    console.log(`Status: ${searchResult.status}`);
    try {
      const json = JSON.parse(searchResult.body);
      if (searchResult.status === 200) {
        console.log(`✅ Found ${json.patients?.length || 0} results`);
        if (json.patients?.length > 0) {
          json.patients.forEach((p, i) => {
            console.log(`   [${i+1}] ${p.name} - ${p.email}`);
          });
        }
      } else {
        console.log(`❌ Error: ${json.error}`);
      }
    } catch (e) {
      console.log('Response:', searchResult.body);
    }
  }

  console.log('\n\nStep 3: Test doctor search with valid token...\n');
  
  const doctorSearches = ['sanika', 'john', 'cardiology'];
  for (const searchTerm of doctorSearches) {
    const searchResult = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: `/api/doctors/search?search=${encodeURIComponent(searchTerm)}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`\n🔍 Searching doctors for: "${searchTerm}"`);
    console.log(`Status: ${searchResult.status}`);
    try {
      const json = JSON.parse(searchResult.body);
      if (searchResult.status === 200) {
        console.log(`✅ Found ${json.doctors?.length || 0} results`);
        if (json.doctors?.length > 0) {
          json.doctors.forEach((d, i) => {
            console.log(`   [${i+1}] Dr. ${d.name} - ${d.specialization}`);
          });
        }
      } else {
        console.log(`❌ Error: ${json.error}`);
      }
    } catch (e) {
      console.log('Response:', searchResult.body);
    }
  }
}

testFlow();
