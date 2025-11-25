const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const appointments = await prisma.appointment.findMany({
      take: 10
    });

    console.log(`Found ${appointments.length} appointments`);

    for (let i = 0; i < appointments.length; i++) {
      const appointment = appointments[i];
      const roomNumber = 100 + (i % 4);
      const tokenNumber = String(1000 + i);

      const updated = await prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          roomId: String(roomNumber),
          tokenNumber: tokenNumber
        }
      });

      console.log(`Updated appointment ${appointment.id}: Room ${roomNumber}, Token ${tokenNumber}`);
    }

    console.log('✅ All appointments updated successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
