const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding inventory alerts and suppliers...\n');

    const alerts = await prisma.inventoryAlert.createMany({
      data: [
        {
          medicineId: 'MED001',
          name: 'Ibuprofen 200mg',
          category: 'Medications',
          currentStock: 12,
          minLevel: 15,
          status: 'Low Stock',
          supplier: 'PharmaTech Inc.',
        },
        {
          medicineId: 'MED002',
          name: 'Amoxicillin 500mg',
          category: 'Medications',
          currentStock: 8,
          minLevel: 10,
          status: 'Low Stock',
          supplier: 'MedPlus Supplies',
        },
        {
          medicineId: 'MED003',
          name: 'Surgical Masks (Box)',
          category: 'Medical Supplies',
          currentStock: 0,
          minLevel: 10,
          status: 'Out of Stock',
          supplier: 'MedPlus Supplies',
        },
        {
          medicineId: 'MED004',
          name: 'Examination Table Paper',
          category: 'Medical Supplies',
          currentStock: 3,
          minLevel: 5,
          status: 'Low Stock',
          supplier: 'Health Supply Co.',
        },
        {
          medicineId: 'MED005',
          name: 'Surgical Gloves (Medium)',
          category: 'Medical Supplies',
          currentStock: 45,
          minLevel: 50,
          status: 'Low Stock',
          supplier: 'MediEquip Solutions',
        },
        {
          medicineId: 'MED006',
          name: 'Alcohol Swabs',
          category: 'Medical Supplies',
          currentStock: 0,
          minLevel: 20,
          status: 'Out of Stock',
          supplier: 'Health Supply Co.',
        },
        {
          medicineId: 'MED007',
          name: 'Paracetamol 500mg',
          category: 'Medications',
          currentStock: 50,
          minLevel: 30,
          status: 'Expiring Soon',
          supplier: 'Global Pharma Ltd.',
        },
        {
          medicineId: 'MED008',
          name: 'Aspirin 100mg',
          category: 'Medications',
          currentStock: 35,
          minLevel: 20,
          status: 'Expiring Soon',
          supplier: 'PharmaTech Inc.',
        },
      ],
    });

    console.log(`✅ Created ${alerts.count} inventory alerts`);

    const suppliers = await prisma.supplier.createMany({
      data: [
        {
          name: 'MedPlus Supplies',
          category: 'Medical Supplies',
          contact: 'Sarah Johnson',
          email: 'contact@medplus.com',
          phone: '(555) 123-4567',
          location: 'Chicago, IL',
          rating: 5,
          status: 'Active',
          description: 'Leading provider of high-quality medical supplies and equipment for healthcare facilities.',
          contactPerson: 'Sarah Johnson',
        },
        {
          name: 'PharmaTech Inc.',
          category: 'Medications',
          contact: 'Michael Chen',
          email: 'sales@pharmatech.com',
          phone: '(543) 987-5643',
          location: 'Boston, MA',
          rating: 4,
          status: 'Active',
          description: 'Specialized pharmaceutical supplier with a wide range of medications and healthcare products.',
          contactPerson: 'Michael Chen',
        },
        {
          name: 'MediEquip Solutions',
          category: 'Equipment',
          contact: 'David Rodriguez',
          email: 'info@mediequip.com',
          phone: '(555) 456-7890',
          location: 'San Diego, CA',
          rating: 4,
          status: 'Active',
          description: 'Premium medical equipment provider specializing in diagnostic and treatment devices.',
          contactPerson: 'David Rodriguez',
        },
        {
          name: 'Health Supply Co.',
          category: 'Medical Supplies',
          contact: 'Emma Wilson',
          email: 'order@healthsupply.com',
          phone: '(555) 789-0123',
          location: 'New York, NY',
          rating: 3,
          status: 'Active',
          description: 'Comprehensive medical supplies vendor for clinics and hospitals.',
          contactPerson: 'Emma Wilson',
        },
        {
          name: 'Global Pharma Ltd.',
          category: 'Medications',
          contact: 'James Wilson',
          email: 'sales@globalpharma.com',
          phone: '(553) 789-0123',
          location: 'New York, NY',
          rating: 5,
          status: 'Active',
          description: 'International pharmaceutical supplier with extensive inventory of medications and treatments.',
          contactPerson: 'James Wilson',
        },
        {
          name: 'Office Depot Medical',
          category: 'Office Supplies',
          contact: 'Lisa Anderson',
          email: 'medical@officedepot.com',
          phone: '(555) 234-5678',
          location: 'Atlanta, GA',
          rating: 4,
          status: 'Active',
          description: 'Office supplies and medical products for healthcare facilities.',
          contactPerson: 'Lisa Anderson',
        },
        {
          name: 'Lab Supplies Direct',
          category: 'Laboratory',
          contact: 'Robert Brown',
          email: 'order@labsupplies.com',
          phone: '(555) 345-6789',
          location: 'Los Angeles, CA',
          rating: 3,
          status: 'Active',
          description: 'Laboratory equipment and supplies vendor.',
          contactPerson: 'Robert Brown',
        },
      ],
    });

    console.log(`✅ Created ${suppliers.count} suppliers`);

    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
