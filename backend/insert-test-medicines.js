const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertTestMedicines() {
  try {
    console.log('Inserting test medicines...');

    const medicines = [
      {
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin',
        category: 'Antibiotics',
        medicineType: 'Prescription',
        medicineForm: 'tablet',
        description: 'Antibiotic for bacterial infections',
        manufacturer: 'PharmaCo Ltd',
        supplier: 'MediSupply Inc',
        dosage: '500mg',
        initialQuantity: 1250,
        reorderLevel: 100,
        maximumLevel: 5000,
        purchasePrice: parseFloat('10.5'),
        sellingPrice: parseFloat('15.0'),
        taxRate: parseFloat('5'),
        status: 'Active',
      },
      {
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        category: 'Analgesics',
        medicineType: 'OTC',
        medicineForm: 'tablet',
        description: 'Pain reliever and fever reducer',
        manufacturer: 'ChemLabs',
        supplier: 'Global Pharma',
        dosage: '500mg',
        initialQuantity: 2500,
        reorderLevel: 200,
        maximumLevel: 8000,
        purchasePrice: parseFloat('5.0'),
        sellingPrice: parseFloat('8.0'),
        taxRate: parseFloat('5'),
        status: 'Active',
      },
      {
        name: 'Metformin 850mg',
        genericName: 'Metformin HCl',
        category: 'Antidiabetics',
        medicineType: 'Prescription',
        medicineForm: 'tablet',
        description: 'Antidiabetic medication',
        manufacturer: 'DiabetesPharm',
        supplier: 'MediSupply Inc',
        dosage: '850mg',
        initialQuantity: 850,
        reorderLevel: 100,
        maximumLevel: 3000,
        purchasePrice: parseFloat('12.0'),
        sellingPrice: parseFloat('18.0'),
        taxRate: parseFloat('5'),
        status: 'Active',
      },
      {
        name: 'Lisinopril 10mg',
        genericName: 'Lisinopril',
        category: 'Antihypertensives',
        medicineType: 'Prescription',
        medicineForm: 'tablet',
        description: 'Blood pressure medication',
        manufacturer: 'CardioPharm',
        supplier: 'Global Pharma',
        dosage: '10mg',
        initialQuantity: 120,
        reorderLevel: 50,
        maximumLevel: 1000,
        purchasePrice: parseFloat('8.5'),
        sellingPrice: parseFloat('12.0'),
        taxRate: parseFloat('5'),
        status: 'Active',
      },
      {
        name: 'Cetirizine 10mg',
        genericName: 'Cetirizine HCl',
        category: 'Antihistamines',
        medicineType: 'OTC',
        medicineForm: 'tablet',
        description: 'Allergy relief',
        manufacturer: 'AllergyMed',
        supplier: 'MediSupply Inc',
        dosage: '10mg',
        initialQuantity: 0,
        reorderLevel: 100,
        maximumLevel: 2000,
        purchasePrice: parseFloat('3.5'),
        sellingPrice: parseFloat('5.5'),
        taxRate: parseFloat('5'),
        status: 'Active',
      },
    ];

    for (const medicine of medicines) {
      try {
        const created = await prisma.medicine.create({
          data: medicine,
        });
        console.log(`✓ Created: ${created.name}`);
      } catch (err) {
        if (err.code === 'P2002') {
          console.log(`⚠ Skipped (already exists): ${medicine.name}`);
        } else {
          console.log(`✗ Error creating ${medicine.name}:`, err.message);
        }
      }
    }

    console.log('\nTest data insertion completed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertTestMedicines();
