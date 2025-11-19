const http = require('http');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000';
const BASE_URL = `${API_URL}/api`;
let token = null;
let testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function makeRequest(method, path, data = null, retries = 0) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(`${BASE_URL}${path}`);
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (token) {
        options.headers.Authorization = `Bearer ${token}`;
      }

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

      req.on('error', (err) => {
        if (retries < 3) {
          setTimeout(() => {
            makeRequest(method, path, data, retries + 1).then(resolve).catch(reject);
          }, 1000);
        } else {
          reject(err);
        }
      });

      if (data) req.write(JSON.stringify(data));
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function login() {
  console.log('🔐 Attempting login...');
  try {
    const response = await makeRequest('POST', '/auth/login', {
      email: 'admin@medixpro.com',
      password: 'password123',
    });
    
    if (response.status === 200 && response.body.token) {
      token = response.body.token;
      console.log('✓ Login successful');
      testResults.passed++;
      return true;
    } else {
      console.log('✗ Login failed:', response.body);
      testResults.failed++;
      testResults.errors.push('Login failed: ' + JSON.stringify(response.body));
      return false;
    }
  } catch (error) {
    console.log('✗ Login error:', error.message);
    testResults.failed++;
    testResults.errors.push('Login error: ' + error.message);
    return false;
  }
}

async function testDashboardAPI() {
  console.log('\n📊 === Testing Dashboard API ===');
  try {
    const response = await makeRequest('GET', '/dashboard/stats');
    if (response.status === 200) {
      console.log('✓ Dashboard Stats retrieved');
      testResults.passed++;
      return true;
    } else {
      console.log('✗ Dashboard Stats failed:', response.body);
      testResults.failed++;
      return false;
    }
  } catch (error) {
    console.log('✗ Dashboard Stats error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testDoctorsAPI() {
  console.log('\n👨‍⚕️ === Testing Doctors API ===');
  let doctorId = null;
  
  try {
    console.log('1. Testing CREATE doctor...');
    const createResponse = await makeRequest('POST', '/doctors', {
      name: `Test Doctor ${Date.now()}`,
      email: `doctor${Date.now()}@test.com`,
      phone: '1234567890',
      specialization: 'Cardiology',
      experience: 5,
      schedule: 'Monday to Friday',
    });

    if (createResponse.status === 201) {
      doctorId = createResponse.body.id;
      console.log('✓ Doctor created');
      testResults.passed++;
    } else {
      console.log('✗ Create doctor failed:', createResponse.body);
      testResults.failed++;
      return false;
    }

    console.log('2. Testing READ doctor by ID...');
    const getResponse = await makeRequest('GET', `/doctors/${doctorId}`);
    if (getResponse.status === 200) {
      console.log('✓ Doctor retrieved');
      testResults.passed++;
    } else {
      console.log('✗ Read doctor failed');
      testResults.failed++;
    }

    console.log('3. Testing LIST doctors...');
    const listResponse = await makeRequest('GET', '/doctors?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log(`✓ Doctors listed (total: ${listResponse.body.total})`);
      testResults.passed++;
    } else {
      console.log('✗ List doctors failed');
      testResults.failed++;
    }

    console.log('4. Testing UPDATE doctor...');
    const updateResponse = await makeRequest('PUT', `/doctors/${doctorId}`, {
      experience: 6,
    });
    if (updateResponse.status === 200) {
      console.log('✓ Doctor updated');
      testResults.passed++;
    } else {
      console.log('✗ Update doctor failed');
      testResults.failed++;
    }

    console.log('5. Testing DELETE doctor...');
    const deleteResponse = await makeRequest('DELETE', `/doctors/${doctorId}`);
    if (deleteResponse.status === 200) {
      console.log('✓ Doctor deleted');
      testResults.passed++;
    } else {
      console.log('✗ Delete doctor failed');
      testResults.failed++;
    }

    return true;
  } catch (error) {
    console.log('✗ Doctors API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testPatientsAPI() {
  console.log('\n👤 === Testing Patients API ===');
  let patientId = null;
  
  try {
    console.log('1. Testing CREATE patient...');
    const createResponse = await makeRequest('POST', '/patients', {
      name: `Test Patient ${Date.now()}`,
      email: `patient${Date.now()}@test.com`,
      phone: '9876543210',
      dob: '1990-01-01',
      gender: 'M',
      address: '123 Test Street',
      history: 'No significant medical history',
    });

    if (createResponse.status === 201) {
      patientId = createResponse.body.id;
      console.log('✓ Patient created');
      testResults.passed++;
    } else {
      console.log('✗ Create patient failed:', createResponse.body);
      testResults.failed++;
      return false;
    }

    console.log('2. Testing READ patient by ID...');
    const getResponse = await makeRequest('GET', `/patients/${patientId}`);
    if (getResponse.status === 200) {
      console.log('✓ Patient retrieved');
      testResults.passed++;
    } else {
      console.log('✗ Read patient failed');
      testResults.failed++;
    }

    console.log('3. Testing LIST patients...');
    const listResponse = await makeRequest('GET', '/patients?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log(`✓ Patients listed (total: ${listResponse.body.total})`);
      testResults.passed++;
    } else {
      console.log('✗ List patients failed');
      testResults.failed++;
    }

    console.log('4. Testing UPDATE patient...');
    const updateResponse = await makeRequest('PUT', `/patients/${patientId}`, {
      phone: '9876543211',
    });
    if (updateResponse.status === 200) {
      console.log('✓ Patient updated');
      testResults.passed++;
    } else {
      console.log('✗ Update patient failed');
      testResults.failed++;
    }

    console.log('5. Testing DELETE patient...');
    const deleteResponse = await makeRequest('DELETE', `/patients/${patientId}`);
    if (deleteResponse.status === 200) {
      console.log('✓ Patient deleted');
      testResults.passed++;
    } else {
      console.log('✗ Delete patient failed');
      testResults.failed++;
    }

    return true;
  } catch (error) {
    console.log('✗ Patients API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testMedicinesAPI() {
  console.log('\n💊 === Testing Medicines/Pharmacy API ===');
  let medicineId = null;
  
  try {
    console.log('1. Testing CREATE medicine...');
    const createResponse = await makeRequest('POST', '/medicines', {
      name: `Test Medicine ${Date.now()}`,
      genericName: 'Test Generic',
      category: 'Antibiotics',
      medicineType: 'Prescription',
      medicineForm: 'tablet',
      purchasePrice: 10.5,
      sellingPrice: 15.0,
      taxRate: 5,
      initialQuantity: 1000,
      reorderLevel: 100,
      maximumLevel: 5000,
      manufacturer: 'Test Manufacturer',
      supplier: 'Test Supplier',
      dosage: '500mg',
      description: 'Test medicine',
    });

    if (createResponse.status === 201) {
      medicineId = createResponse.body.id;
      console.log('✓ Medicine created');
      testResults.passed++;
    } else {
      console.log('✗ Create medicine failed:', createResponse.body);
      testResults.failed++;
      return false;
    }

    console.log('2. Testing READ medicine...');
    const getResponse = await makeRequest('GET', `/medicines/${medicineId}`);
    if (getResponse.status === 200) {
      console.log('✓ Medicine retrieved');
      testResults.passed++;
    } else {
      console.log('✗ Read medicine failed');
      testResults.failed++;
    }

    console.log('3. Testing LIST medicines...');
    const listResponse = await makeRequest('GET', '/medicines?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log(`✓ Medicines listed (total: ${listResponse.body.total})`);
      testResults.passed++;
    } else {
      console.log('✗ List medicines failed');
      testResults.failed++;
    }

    console.log('4. Testing UPDATE medicine...');
    const updateResponse = await makeRequest('PUT', `/medicines/${medicineId}`, {
      initialQuantity: 2000,
    });
    if (updateResponse.status === 200) {
      console.log('✓ Medicine updated');
      testResults.passed++;
    } else {
      console.log('✗ Update medicine failed');
      testResults.failed++;
    }

    console.log('5. Testing DELETE medicine...');
    const deleteResponse = await makeRequest('DELETE', `/medicines/${medicineId}`);
    if (deleteResponse.status === 200) {
      console.log('✓ Medicine deleted');
      testResults.passed++;
    } else {
      console.log('✗ Delete medicine failed');
      testResults.failed++;
    }

    return true;
  } catch (error) {
    console.log('✗ Medicines API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testAmbulanceAPI() {
  console.log('\n🚑 === Testing Ambulance API ===');
  let ambulanceId = null;
  
  try {
    console.log('1. Testing CREATE ambulance...');
    const createResponse = await makeRequest('POST', '/ambulances', {
      name: `Ambulance ${Date.now()}`,
      registrationNumber: `REG${Date.now()}`,
      driverName: 'John Driver',
      driverPhone: '1234567890',
      status: 'available',
      location: 'Main Hospital',
    });

    if (createResponse.status === 201) {
      ambulanceId = createResponse.body.id;
      console.log('✓ Ambulance created');
      testResults.passed++;
    } else {
      console.log('✗ Create ambulance failed:', createResponse.body);
      testResults.failed++;
      return false;
    }

    console.log('2. Testing READ ambulance...');
    const getResponse = await makeRequest('GET', `/ambulances/${ambulanceId}`);
    if (getResponse.status === 200) {
      console.log('✓ Ambulance retrieved');
      testResults.passed++;
    } else {
      console.log('✗ Read ambulance failed');
      testResults.failed++;
    }

    console.log('3. Testing LIST ambulances...');
    const listResponse = await makeRequest('GET', '/ambulances?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log(`✓ Ambulances listed (total: ${listResponse.body.total})`);
      testResults.passed++;
    } else {
      console.log('✗ List ambulances failed');
      testResults.failed++;
    }

    console.log('4. Testing UPDATE ambulance...');
    const updateResponse = await makeRequest('PUT', `/ambulances/${ambulanceId}`, {
      status: 'maintenance',
    });
    if (updateResponse.status === 200) {
      console.log('✓ Ambulance updated');
      testResults.passed++;
    } else {
      console.log('✗ Update ambulance failed');
      testResults.failed++;
    }

    console.log('5. Testing DELETE ambulance...');
    const deleteResponse = await makeRequest('DELETE', `/ambulances/${ambulanceId}`);
    if (deleteResponse.status === 200) {
      console.log('✓ Ambulance deleted');
      testResults.passed++;
    } else {
      console.log('✗ Delete ambulance failed');
      testResults.failed++;
    }

    return true;
  } catch (error) {
    console.log('✗ Ambulance API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testDepartmentsAPI() {
  console.log('\n🏥 === Testing Departments API ===');
  let departmentId = null;
  
  try {
    console.log('1. Testing CREATE department...');
    const createResponse = await makeRequest('POST', '/departments', {
      name: `Dept ${Date.now()}`,
      head: 'Dr. Head',
      location: 'Building A',
      staffCount: 10,
      services: 5,
      status: 'Active',
      description: 'Test Department',
    });

    if (createResponse.status === 201) {
      departmentId = createResponse.body.id;
      console.log('✓ Department created');
      testResults.passed++;
    } else {
      console.log('✗ Create department failed:', createResponse.body);
      testResults.failed++;
      return false;
    }

    console.log('2. Testing READ department...');
    const getResponse = await makeRequest('GET', `/departments/${departmentId}`);
    if (getResponse.status === 200) {
      console.log('✓ Department retrieved');
      testResults.passed++;
    } else {
      console.log('✗ Read department failed');
      testResults.failed++;
    }

    console.log('3. Testing LIST departments...');
    const listResponse = await makeRequest('GET', '/departments?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log(`✓ Departments listed`);
      testResults.passed++;
    } else {
      console.log('✗ List departments failed');
      testResults.failed++;
    }

    console.log('4. Testing UPDATE department...');
    const updateResponse = await makeRequest('PUT', `/departments/${departmentId}`, {
      staffCount: 15,
    });
    if (updateResponse.status === 200) {
      console.log('✓ Department updated');
      testResults.passed++;
    } else {
      console.log('✗ Update department failed');
      testResults.failed++;
    }

    console.log('5. Testing DELETE department...');
    const deleteResponse = await makeRequest('DELETE', `/departments/${departmentId}`);
    if (deleteResponse.status === 200) {
      console.log('✓ Department deleted');
      testResults.passed++;
    } else {
      console.log('✗ Delete department failed');
      testResults.failed++;
    }

    return true;
  } catch (error) {
    console.log('✗ Departments API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testStaffAPI() {
  console.log('\n👥 === Testing Staff API ===');
  let staffId = null;
  
  try {
    console.log('1. Testing CREATE staff...');
    const createResponse = await makeRequest('POST', '/staff', {
      firstName: 'Test',
      lastName: `Staff${Date.now()}`,
      email: `staff${Date.now()}@test.com`,
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'M',
      address: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      country: 'USA',
      emergencyContact: 'Emergency',
      emergencyPhone: '9999999999',
      role: 'Nurse',
      department: 'General',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    });

    if (createResponse.status === 201) {
      staffId = createResponse.body.id;
      console.log('✓ Staff created');
      testResults.passed++;
    } else {
      console.log('✗ Create staff failed:', createResponse.body);
      testResults.failed++;
      return false;
    }

    console.log('2. Testing READ staff...');
    const getResponse = await makeRequest('GET', `/staff/${staffId}`);
    if (getResponse.status === 200) {
      console.log('✓ Staff retrieved');
      testResults.passed++;
    } else {
      console.log('✗ Read staff failed');
      testResults.failed++;
    }

    console.log('3. Testing LIST staff...');
    const listResponse = await makeRequest('GET', '/staff?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log(`✓ Staff listed`);
      testResults.passed++;
    } else {
      console.log('✗ List staff failed');
      testResults.failed++;
    }

    console.log('4. Testing UPDATE staff...');
    const updateResponse = await makeRequest('PUT', `/staff/${staffId}`, {
      role: 'Senior Nurse',
    });
    if (updateResponse.status === 200) {
      console.log('✓ Staff updated');
      testResults.passed++;
    } else {
      console.log('✗ Update staff failed');
      testResults.failed++;
    }

    console.log('5. Testing DELETE staff...');
    const deleteResponse = await makeRequest('DELETE', `/staff/${staffId}`);
    if (deleteResponse.status === 200) {
      console.log('✓ Staff deleted');
      testResults.passed++;
    } else {
      console.log('✗ Delete staff failed');
      testResults.failed++;
    }

    return true;
  } catch (error) {
    console.log('✗ Staff API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testBloodBankAPI() {
  console.log('\n🩸 === Testing Blood Bank API ===');
  let bloodId = null;
  
  try {
    console.log('1. Testing CREATE blood inventory...');
    const createResponse = await makeRequest('POST', '/blood-bank', {
      bloodType: 'O+',
      quantity: 50,
      collectionDate: new Date().toISOString(),
      status: 'available',
      donorName: 'John Donor',
    });

    if (createResponse.status === 201) {
      bloodId = createResponse.body.id;
      console.log('✓ Blood inventory created');
      testResults.passed++;
    } else {
      console.log('✗ Create blood inventory failed:', createResponse.body);
      testResults.failed++;
      return false;
    }

    console.log('2. Testing LIST blood inventory...');
    const listResponse = await makeRequest('GET', '/blood-bank');
    if (listResponse.status === 200) {
      console.log('✓ Blood inventory listed');
      testResults.passed++;
    } else {
      console.log('✗ List blood inventory failed');
      testResults.failed++;
    }

    console.log('3. Testing UPDATE blood inventory...');
    const updateResponse = await makeRequest('PUT', `/blood-bank/${bloodId}`, {
      quantity: 45,
    });
    if (updateResponse.status === 200) {
      console.log('✓ Blood inventory updated');
      testResults.passed++;
    } else {
      console.log('✗ Update blood inventory failed');
      testResults.failed++;
    }

    console.log('4. Testing DELETE blood inventory...');
    const deleteResponse = await makeRequest('DELETE', `/blood-bank/${bloodId}`);
    if (deleteResponse.status === 200) {
      console.log('✓ Blood inventory deleted');
      testResults.passed++;
    } else {
      console.log('✗ Delete blood inventory failed');
      testResults.failed++;
    }

    return true;
  } catch (error) {
    console.log('✗ Blood Bank API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testInventoryAlertsAPI() {
  console.log('\n📍 === Testing Inventory Alerts API ===');
  let alertId = null;
  
  try {
    console.log('1. Testing CREATE inventory alert...');
    const createResponse = await makeRequest('POST', '/inventory-alerts', {
      medicineId: 'test-med-' + Date.now(),
      name: `Alert ${Date.now()}`,
      category: 'Antibiotics',
      currentStock: 50,
      minLevel: 100,
      status: 'Low Stock',
      supplier: 'Test Supplier',
    });

    if (createResponse.status === 201) {
      alertId = createResponse.body.id;
      console.log('✓ Inventory alert created');
      testResults.passed++;
    } else {
      console.log('✗ Create alert failed:', createResponse.body);
      testResults.failed++;
      return false;
    }

    console.log('2. Testing READ alert...');
    const getResponse = await makeRequest('GET', `/inventory-alerts/${alertId}`);
    if (getResponse.status === 200) {
      console.log('✓ Alert retrieved');
      testResults.passed++;
    } else {
      console.log('✗ Read alert failed');
      testResults.failed++;
    }

    console.log('3. Testing LIST alerts...');
    const listResponse = await makeRequest('GET', '/inventory-alerts?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log('✓ Alerts listed');
      testResults.passed++;
    } else {
      console.log('✗ List alerts failed');
      testResults.failed++;
    }

    console.log('4. Testing UPDATE alert...');
    const updateResponse = await makeRequest('PUT', `/inventory-alerts/${alertId}`, {
      currentStock: 60,
    });
    if (updateResponse.status === 200) {
      console.log('✓ Alert updated');
      testResults.passed++;
    } else {
      console.log('✗ Update alert failed');
      testResults.failed++;
    }

    console.log('5. Testing DELETE alert...');
    const deleteResponse = await makeRequest('DELETE', `/inventory-alerts/${alertId}`);
    if (deleteResponse.status === 200) {
      console.log('✓ Alert deleted');
      testResults.passed++;
    } else {
      console.log('✗ Delete alert failed');
      testResults.failed++;
    }

    return true;
  } catch (error) {
    console.log('✗ Inventory Alerts API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testAppointmentsAPI() {
  console.log('\n📅 === Testing Appointments API ===');
  let appointmentId = null;
  
  try {
    console.log('1. Testing CREATE appointment...');
    const createResponse = await makeRequest('POST', '/appointments', {
      doctorId: 'test-doctor-' + Date.now(),
      patientId: 'test-patient-' + Date.now(),
      date: new Date().toISOString(),
      time: '10:00 AM',
      status: 'pending',
      notes: 'Test appointment',
    });

    if (createResponse.status === 201) {
      appointmentId = createResponse.body.id;
      console.log('✓ Appointment created');
      testResults.passed++;
    } else {
      console.log('✗ Create appointment failed');
      testResults.failed++;
      return false;
    }

    console.log('2. Testing LIST appointments...');
    const listResponse = await makeRequest('GET', '/appointments?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log('✓ Appointments listed');
      testResults.passed++;
    } else {
      console.log('✗ List appointments failed');
      testResults.failed++;
    }

    if (appointmentId) {
      console.log('3. Testing UPDATE appointment...');
      const updateResponse = await makeRequest('PUT', `/appointments/${appointmentId}`, {
        status: 'confirmed',
      });
      if (updateResponse.status === 200) {
        console.log('✓ Appointment updated');
        testResults.passed++;
      } else {
        console.log('✗ Update appointment failed');
        testResults.failed++;
      }

      console.log('4. Testing DELETE appointment...');
      const deleteResponse = await makeRequest('DELETE', `/appointments/${appointmentId}`);
      if (deleteResponse.status === 200) {
        console.log('✓ Appointment deleted');
        testResults.passed++;
      } else {
        console.log('✗ Delete appointment failed');
        testResults.failed++;
      }
    }

    return true;
  } catch (error) {
    console.log('✗ Appointments API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testPrescriptionsAPI() {
  console.log('\n💉 === Testing Prescriptions API ===');
  let prescriptionId = null;
  
  try {
    console.log('1. Testing CREATE prescription...');
    const createResponse = await makeRequest('POST', '/prescriptions', {
      patientId: 'test-patient-' + Date.now(),
      doctorId: 'test-doctor-' + Date.now(),
      medicineId: 'test-medicine-' + Date.now(),
      dosage: '500mg',
      frequency: '3 times daily',
      duration: '7 days',
      notes: 'Take after meals',
    });

    if (createResponse.status === 201) {
      prescriptionId = createResponse.body.id;
      console.log('✓ Prescription created');
      testResults.passed++;
    } else {
      console.log('✗ Create prescription failed');
      testResults.failed++;
    }

    console.log('2. Testing LIST prescriptions...');
    const listResponse = await makeRequest('GET', '/prescriptions');
    if (listResponse.status === 200) {
      console.log('✓ Prescriptions listed');
      testResults.passed++;
    } else {
      console.log('✗ List prescriptions failed');
      testResults.failed++;
    }

    if (prescriptionId) {
      console.log('3. Testing UPDATE prescription...');
      const updateResponse = await makeRequest('PUT', `/prescriptions/${prescriptionId}`, {
        dosage: '250mg',
      });
      if (updateResponse.status === 200) {
        console.log('✓ Prescription updated');
        testResults.passed++;
      } else {
        console.log('✗ Update prescription failed');
        testResults.failed++;
      }

      console.log('4. Testing DELETE prescription...');
      const deleteResponse = await makeRequest('DELETE', `/prescriptions/${prescriptionId}`);
      if (deleteResponse.status === 200) {
        console.log('✓ Prescription deleted');
        testResults.passed++;
      } else {
        console.log('✗ Delete prescription failed');
        testResults.failed++;
      }
    }

    return true;
  } catch (error) {
    console.log('✗ Prescriptions API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testRoomAllotmentAPI() {
  console.log('\n🛏️ === Testing Room Allotment API ===');
  let allotmentId = null;
  
  try {
    console.log('1. Testing CREATE room allotment...');
    const createResponse = await makeRequest('POST', '/room-allotment', {
      patientId: 'test-patient-' + Date.now(),
      roomId: 'test-room-' + Date.now(),
      allotmentDate: new Date().toISOString(),
      status: 'active',
    });

    if (createResponse.status === 201) {
      allotmentId = createResponse.body.id;
      console.log('✓ Room allotment created');
      testResults.passed++;
    } else {
      console.log('✗ Create room allotment failed');
      testResults.failed++;
    }

    console.log('2. Testing LIST room allotments...');
    const listResponse = await makeRequest('GET', '/room-allotment');
    if (listResponse.status === 200) {
      console.log('✓ Room allotments listed');
      testResults.passed++;
    } else {
      console.log('✗ List room allotments failed');
      testResults.failed++;
    }

    if (allotmentId) {
      console.log('3. Testing UPDATE room allotment...');
      const updateResponse = await makeRequest('PUT', `/room-allotment/${allotmentId}`, {
        status: 'discharged',
      });
      if (updateResponse.status === 200) {
        console.log('✓ Room allotment updated');
        testResults.passed++;
      } else {
        console.log('✗ Update room allotment failed');
        testResults.failed++;
      }

      console.log('4. Testing DELETE room allotment...');
      const deleteResponse = await makeRequest('DELETE', `/room-allotment/${allotmentId}`);
      if (deleteResponse.status === 200) {
        console.log('✓ Room allotment deleted');
        testResults.passed++;
      } else {
        console.log('✗ Delete room allotment failed');
        testResults.failed++;
      }
    }

    return true;
  } catch (error) {
    console.log('✗ Room Allotment API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testRecordsAPI() {
  console.log('\n📝 === Testing Records API ===');
  let recordId = null;
  
  try {
    console.log('1. Testing CREATE record...');
    const createResponse = await makeRequest('POST', '/records', {
      type: 'Birth',
      patientName: `Patient${Date.now()}`,
      date: new Date().toISOString(),
      details: 'Birth record details',
      status: 'Active',
    });

    if (createResponse.status === 201) {
      recordId = createResponse.body.id;
      console.log('✓ Record created');
      testResults.passed++;
    } else {
      console.log('✗ Create record failed');
      testResults.failed++;
    }

    console.log('2. Testing LIST records...');
    const listResponse = await makeRequest('GET', '/records?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log('✓ Records listed');
      testResults.passed++;
    } else {
      console.log('✗ List records failed');
      testResults.failed++;
    }

    if (recordId) {
      console.log('3. Testing UPDATE record...');
      const updateResponse = await makeRequest('PUT', `/records/${recordId}`, {
        details: 'Updated details',
      });
      if (updateResponse.status === 200) {
        console.log('✓ Record updated');
        testResults.passed++;
      } else {
        console.log('✗ Update record failed');
        testResults.failed++;
      }

      console.log('4. Testing DELETE record...');
      const deleteResponse = await makeRequest('DELETE', `/records/${recordId}`);
      if (deleteResponse.status === 200) {
        console.log('✓ Record deleted');
        testResults.passed++;
      } else {
        console.log('✗ Delete record failed');
        testResults.failed++;
      }
    }

    return true;
  } catch (error) {
    console.log('✗ Records API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testReviewsAPI() {
  console.log('\n⭐ === Testing Reviews API ===');
  let reviewId = null;
  
  try {
    console.log('1. Testing CREATE review...');
    const createResponse = await makeRequest('POST', '/reviews', {
      type: 'Doctor',
      subjectName: `Doctor${Date.now()}`,
      rating: 5,
      comment: 'Excellent service',
      reviewerName: 'Patient Name',
      status: 'Active',
    });

    if (createResponse.status === 201) {
      reviewId = createResponse.body.id;
      console.log('✓ Review created');
      testResults.passed++;
    } else {
      console.log('✗ Create review failed');
      testResults.failed++;
    }

    console.log('2. Testing LIST reviews...');
    const listResponse = await makeRequest('GET', '/reviews?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log('✓ Reviews listed');
      testResults.passed++;
    } else {
      console.log('✗ List reviews failed');
      testResults.failed++;
    }

    if (reviewId) {
      console.log('3. Testing UPDATE review...');
      const updateResponse = await makeRequest('PUT', `/reviews/${reviewId}`, {
        rating: 4,
      });
      if (updateResponse.status === 200) {
        console.log('✓ Review updated');
        testResults.passed++;
      } else {
        console.log('✗ Update review failed');
        testResults.failed++;
      }

      console.log('4. Testing DELETE review...');
      const deleteResponse = await makeRequest('DELETE', `/reviews/${reviewId}`);
      if (deleteResponse.status === 200) {
        console.log('✓ Review deleted');
        testResults.passed++;
      } else {
        console.log('✗ Delete review failed');
        testResults.failed++;
      }
    }

    return true;
  } catch (error) {
    console.log('✗ Reviews API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testFeedbackAPI() {
  console.log('\n💬 === Testing Feedback API ===');
  let feedbackId = null;
  
  try {
    console.log('1. Testing CREATE feedback...');
    const createResponse = await makeRequest('POST', '/feedback', {
      subject: `Feedback ${Date.now()}`,
      message: 'This is test feedback',
      senderName: 'Test User',
      senderEmail: 'test@example.com',
      category: 'General',
      status: 'Pending',
    });

    if (createResponse.status === 201) {
      feedbackId = createResponse.body.id;
      console.log('✓ Feedback created');
      testResults.passed++;
    } else {
      console.log('✗ Create feedback failed');
      testResults.failed++;
    }

    console.log('2. Testing LIST feedbacks...');
    const listResponse = await makeRequest('GET', '/feedback?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log('✓ Feedbacks listed');
      testResults.passed++;
    } else {
      console.log('✗ List feedbacks failed');
      testResults.failed++;
    }

    if (feedbackId) {
      console.log('3. Testing UPDATE feedback...');
      const updateResponse = await makeRequest('PUT', `/feedback/${feedbackId}`, {
        status: 'Resolved',
      });
      if (updateResponse.status === 200) {
        console.log('✓ Feedback updated');
        testResults.passed++;
      } else {
        console.log('✗ Update feedback failed');
        testResults.failed++;
      }

      console.log('4. Testing DELETE feedback...');
      const deleteResponse = await makeRequest('DELETE', `/feedback/${feedbackId}`);
      if (deleteResponse.status === 200) {
        console.log('✓ Feedback deleted');
        testResults.passed++;
      } else {
        console.log('✗ Delete feedback failed');
        testResults.failed++;
      }
    }

    return true;
  } catch (error) {
    console.log('✗ Feedback API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function testReportsAPI() {
  console.log('\n📊 === Testing Reports API ===');
  let reportId = null;
  
  try {
    console.log('1. Testing CREATE report...');
    const createResponse = await makeRequest('POST', '/reports', {
      type: 'Appointment',
      title: `Report ${Date.now()}`,
      data: { summary: 'Test report data' },
      period: 'Monthly',
      generatedBy: 'Admin',
    });

    if (createResponse.status === 201) {
      reportId = createResponse.body.id;
      console.log('✓ Report created');
      testResults.passed++;
    } else {
      console.log('✗ Create report failed');
      testResults.failed++;
    }

    console.log('2. Testing LIST reports...');
    const listResponse = await makeRequest('GET', '/reports?page=1&limit=10');
    if (listResponse.status === 200) {
      console.log('✓ Reports listed');
      testResults.passed++;
    } else {
      console.log('✗ List reports failed');
      testResults.failed++;
    }

    if (reportId) {
      console.log('3. Testing UPDATE report...');
      const updateResponse = await makeRequest('PUT', `/reports/${reportId}`, {
        period: 'Quarterly',
      });
      if (updateResponse.status === 200) {
        console.log('✓ Report updated');
        testResults.passed++;
      } else {
        console.log('✗ Update report failed');
        testResults.failed++;
      }

      console.log('4. Testing DELETE report...');
      const deleteResponse = await makeRequest('DELETE', `/reports/${reportId}`);
      if (deleteResponse.status === 200) {
        console.log('✓ Report deleted');
        testResults.passed++;
      } else {
        console.log('✗ Delete report failed');
        testResults.failed++;
      }
    }

    return true;
  } catch (error) {
    console.log('✗ Reports API error:', error.message);
    testResults.failed++;
    return false;
  }
}

async function runAllTests() {
  console.log('\n========================================');
  console.log('   Healthcare CRM - Comprehensive Test');
  console.log('========================================\n');
  
  try {
    if (await login()) {
      await testDashboardAPI();
      await testDoctorsAPI();
      await testPatientsAPI();
      await testAppointmentsAPI();
      await testPrescriptionsAPI();
      await testMedicinesAPI();
      await testAmbulanceAPI();
      await testDepartmentsAPI();
      await testStaffAPI();
      await testBloodBankAPI();
      await testInventoryAlertsAPI();
      await testRoomAllotmentAPI();
      await testRecordsAPI();
      await testReviewsAPI();
      await testFeedbackAPI();
      await testReportsAPI();
    }
  } catch (error) {
    console.error('Test error:', error);
    testResults.failed++;
  }

  console.log('\n========================================');
  console.log('   Test Results Summary');
  console.log('========================================');
  console.log(`✓ Passed: ${testResults.passed}`);
  console.log(`✗ Failed: ${testResults.failed}`);
  console.log(`Total: ${testResults.passed + testResults.failed}`);
  
  if (testResults.errors.length > 0) {
    console.log('\nErrors:');
    testResults.errors.forEach((err, idx) => {
      console.log(`${idx + 1}. ${err}`);
    });
  }
  console.log('\n========================================\n');
  
  process.exit(testResults.failed > 0 ? 1 : 0);
}

runAllTests();
