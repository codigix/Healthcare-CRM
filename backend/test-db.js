const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users in database:', users);
    
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@medixpro.com' }
    });
    console.log('Admin user found:', adminUser);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
