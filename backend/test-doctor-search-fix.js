const http = require('http');

const API_URL = 'http://localhost:5000/api';

const makeRequest = (method, path, headers = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const testDoctorSearch = async () => {
  try {
    console.log('='.repeat(60));
    console.log('DOCTOR SEARCH FIX VERIFICATION');
    console.log('='.repeat(60));
    
    console.log('\n1. Testing Login...');
    const loginResponse = await makeRequest('POST', '/auth/login', {}, {
      email: 'admin@medixpro.com',
      password: 'password123'
    });
    
    if (loginResponse.status !== 200) {
      throw new Error(`Login failed: ${loginResponse.status} - ${JSON.stringify(loginResponse.data)}`);
    }
    
    const token = loginResponse.data.token;
    console.log('✓ Login successful');
    
    const authHeaders = {
      'Authorization': `Bearer ${token}`
    };
    
    // Test 1: Search for a doctor
    console.log('\n2. Testing Doctor Search for "aurtho"...');
    try {
      const searchResponse = await makeRequest('GET', '/doctors/search?search=aurtho', authHeaders);
      
      console.log('Status:', searchResponse.status);
      console.log('Response:', JSON.stringify(searchResponse.data, null, 2));
      
      if (searchResponse.data.doctors && searchResponse.data.doctors.length > 0) {
        console.log('✓ Doctor found:', searchResponse.data.doctors[0].name);
      } else {
        console.log('⚠ No doctors found with "aurtho" search');
      }
    } catch (error) {
      console.log('✗ Search error:', error.message);
    }
    
    // Test 2: Search for "DR.aurtho kale"
    console.log('\n3. Testing Doctor Search for "DR.aurtho kale"...');
    try {
      const searchResponse = await makeRequest('GET', '/doctors/search?search=DR.aurtho%20kale', authHeaders);
      
      console.log('Status:', searchResponse.status);
      console.log('Response:', JSON.stringify(searchResponse.data, null, 2));
      
      if (searchResponse.data.doctors && searchResponse.data.doctors.length > 0) {
        console.log('✓ Doctor found:', searchResponse.data.doctors[0].name);
      } else {
        console.log('⚠ No doctors found with "DR.aurtho kale" search');
      }
    } catch (error) {
      console.log('✗ Search error:', error.message);
    }
    
    // Test 3: Get all doctors
    console.log('\n4. Getting all available doctors...');
    try {
      const allDoctorsResponse = await makeRequest('GET', '/doctors', authHeaders);
      console.log('Total doctors in system:', allDoctorsResponse.data.total);
      
      console.log('\nDoctors list:');
      allDoctorsResponse.data.doctors.forEach((doc, idx) => {
        console.log(`  ${idx + 1}. ${doc.name} - ${doc.specialization} (ID: ${doc.id.substring(0, 8)}...)`);
      });
    } catch (error) {
      console.log('✗ Get all doctors error:', error.message);
    }
    
    // Test 4: Search for available doctors by specialization
    console.log('\n5. Testing Available Doctors for "Neurology"...');
    try {
      const availableResponse = await makeRequest('GET', '/doctors/available?specialization=Neurology', authHeaders);
      
      console.log('Status:', availableResponse.status);
      if (availableResponse.data.doctors && availableResponse.data.doctors.length > 0) {
        console.log('✓ Found', availableResponse.data.doctors.length, 'doctor(s) in Neurology');
        availableResponse.data.doctors.forEach(doc => {
          console.log(`  - ${doc.name}`);
        });
      } else {
        console.log('⚠ No doctors available in Neurology specialization');
      }
    } catch (error) {
      console.log('✗ Available doctors error:', error.message);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('Test completed!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
  
  process.exit(0);
};

testDoctorSearch();
