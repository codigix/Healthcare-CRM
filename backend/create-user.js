const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser() {
  try {
    const hashedPassword = await bcrypt.hash('Password@123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@medixpro.com',
        password: hashedPassword,
        role: 'admin',
      },
    });
    
    console.log('User created successfully:', user);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
