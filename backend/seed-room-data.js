const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRoomData() {
  try {
    console.log('🌱 Starting room and allocation data seed...\n');

    const roomsData = [
      {
        roomNumber: '101',
        roomType: 'Standard',
        department: 'General',
        floor: '1',
        capacity: 3,
        pricePerDay: 500,
        description: 'Standard room with basic amenities',
      },
      {
        roomNumber: '102',
        roomType: 'Deluxe',
        department: 'General',
        floor: '1',
        capacity: 2,
        pricePerDay: 800,
        description: 'Deluxe room with premium amenities',
      },
      {
        roomNumber: '103',
        roomType: 'ICU',
        department: 'ICU',
        floor: '2',
        capacity: 1,
        pricePerDay: 2000,
        description: 'Intensive Care Unit with advanced monitoring',
      },
      {
        roomNumber: '104',
        roomType: 'Standard',
        department: 'General',
        floor: '1',
        capacity: 3,
        pricePerDay: 500,
        description: 'Standard room with basic amenities',
      },
      {
        roomNumber: '201',
        roomType: 'Deluxe',
        department: 'Surgery',
        floor: '2',
        capacity: 2,
        pricePerDay: 1000,
        description: 'Deluxe post-surgery recovery room',
      },
      {
        roomNumber: '202',
        roomType: 'Standard',
        department: 'Surgery',
        floor: '2',
        capacity: 3,
        pricePerDay: 600,
        description: 'Standard post-surgery room',
      },
    ];

    console.log('📝 Creating rooms...');
    const createdRooms = [];

    for (const roomData of roomsData) {
      const existingRoom = await prisma.room.findUnique({
        where: { roomNumber: roomData.roomNumber },
      });

      if (!existingRoom) {
        const room = await prisma.room.create({
          data: {
            ...roomData,
            pricePerDay: String(roomData.pricePerDay),
          },
        });
        createdRooms.push(room);
        console.log(`  ✅ Room ${room.roomNumber} created (${room.roomType})`);
      } else {
        createdRooms.push(existingRoom);
        console.log(`  ⏭️  Room ${existingRoom.roomNumber} already exists`);
      }
    }

    console.log('\n📋 Adding patient allocations...');

    const allocationsData = [
      {
        roomNumber: '101',
        patientName: 'Vikram Desai',
        patientPhone: '9876543210',
        attendingDoctor: 'Dr. Sanika Mote',
        status: 'Occupied',
      },
      {
        roomNumber: '101',
        patientName: 'Aditi More',
        patientPhone: '9123456789',
        attendingDoctor: 'Dr. Sanika Mote',
        status: 'Occupied',
      },
      {
        roomNumber: '102',
        patientName: 'Chetana Kale',
        patientPhone: '9988776655',
        attendingDoctor: 'Dr. Rahul Singh',
        status: 'Occupied',
      },
      {
        roomNumber: '103',
        patientName: 'Suresh Patil',
        patientPhone: '9654321098',
        attendingDoctor: 'Dr. Priya Sharma',
        status: 'Occupied',
      },
      {
        roomNumber: '201',
        patientName: 'Anjali Kumar',
        patientPhone: '9876123456',
        attendingDoctor: 'Dr. Sanjay Gupta',
        status: 'Occupied',
      },
    ];

    for (const allocation of allocationsData) {
      const room = createdRooms.find((r) => r.roomNumber === allocation.roomNumber);

      if (room) {
        const existingAllocation = await prisma.roomAllotment.findFirst({
          where: {
            patientName: allocation.patientName,
            roomId: room.id,
          },
        });

        if (!existingAllocation) {
          await prisma.roomAllotment.create({
            data: {
              patientId: `patient-${Date.now()}-${Math.random()}`,
              patientName: allocation.patientName,
              patientPhone: allocation.patientPhone,
              roomId: room.id,
              attendingDoctor: allocation.attendingDoctor,
              allotmentDate: new Date(),
              status: allocation.status,
            },
          });
          console.log(
            `  ✅ ${allocation.patientName} allocated to Room ${allocation.roomNumber}`,
          );
        } else {
          console.log(
            `  ⏭️  ${allocation.patientName} already allocated to Room ${allocation.roomNumber}`,
          );
        }
      }
    }

    console.log('\n🎉 Room and allocation data seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Total Rooms: ${createdRooms.length}`);
    console.log(`   - Total Allocations: ${allocationsData.length}`);
  } catch (error) {
    console.error('\n❌ Error seeding room data:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedRoomData();
