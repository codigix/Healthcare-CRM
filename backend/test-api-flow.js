const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token = null;

async function testAPI() {
  try {
    console.log('=== Testing Complete Medicine API Workflow ===\n');

    // Step 1: Login
    console.log('Step 1: Logging in...');
    try {
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@medixpro.com',
        password: 'password123',
      });
      token = loginRes.data.token;
      console.log('✓ Login successful\n');
    } catch (err) {
      console.log('✗ Login failed. Using unauthenticated request...\n');
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Step 2: Fetch all medicines
    console.log('Step 2: Fetching all medicines...');
    const medicinesRes = await axios.get(`${BASE_URL}/medicines`, { headers });
    console.log(`✓ Fetched ${medicinesRes.data.medicines.length} medicines`);
    console.log(`  Total medicines in database: ${medicinesRes.data.total}\n`);

    if (medicinesRes.data.medicines.length > 0) {
      const firstMedicine = medicinesRes.data.medicines[0];
      console.log(`Sample medicine: ${firstMedicine.name}`);

      // Step 3: Get specific medicine
      console.log(`\nStep 3: Fetching specific medicine (${firstMedicine.id})...`);
      const getMedicineRes = await axios.get(`${BASE_URL}/medicines/${firstMedicine.id}`, { headers });
      console.log(`✓ Retrieved: ${getMedicineRes.data.name}`);
      console.log(`  Category: ${getMedicineRes.data.category}`);
      console.log(`  Stock: ${getMedicineRes.data.initialQuantity} units`);
      console.log(`  Expiry: ${getMedicineRes.data.expiryDate || 'Not set'}\n`);

      // Step 4: Search medicines
      console.log('Step 4: Searching for medicines...');
      const searchRes = await axios.get(`${BASE_URL}/medicines?search=Amoxicillin`, { headers });
      console.log(`✓ Search results: ${searchRes.data.medicines.length} found\n`);

      // Step 5: Filter by category
      console.log('Step 5: Filtering by category...');
      const filterRes = await axios.get(`${BASE_URL}/medicines?category=Antibiotics`, { headers });
      console.log(`✓ Antibiotics category: ${filterRes.data.medicines.length} medicines\n`);

      // Step 6: Create a new medicine
      if (token) {
        console.log('Step 6: Creating new medicine...');
        const createRes = await axios.post(
          `${BASE_URL}/medicines`,
          {
            name: 'Ibuprofen 400mg',
            genericName: 'Ibuprofen',
            category: 'NSAIDs',
            medicineType: 'OTC',
            medicineForm: 'tablet',
            purchasePrice: 4.5,
            sellingPrice: 7.0,
            initialQuantity: 2800,
            reorderLevel: 200,
            maximumLevel: 5000,
            dosage: '400mg',
            description: 'Anti-inflammatory pain reliever',
          },
          { headers }
        );
        console.log(`✓ Created new medicine: ${createRes.data.name}\n`);

        // Step 7: Update medicine
        console.log(`Step 7: Updating medicine...`);
        const updateRes = await axios.put(
          `${BASE_URL}/medicines/${createRes.data.id}`,
          {
            initialQuantity: 3000,
            sellingPrice: 8.0,
          },
          { headers }
        );
        console.log(`✓ Updated: Stock now ${updateRes.data.initialQuantity}, Price: $${updateRes.data.sellingPrice}\n`);

        // Step 8: Delete medicine
        console.log(`Step 8: Deleting medicine...`);
        await axios.delete(`${BASE_URL}/medicines/${createRes.data.id}`, { headers });
        console.log(`✓ Deleted successfully\n`);
      } else {
        console.log('Step 6-8: Skipped (no authentication token)\n');
      }
    }

    console.log('=== API Tests Completed Successfully ===');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAPI();
