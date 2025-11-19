const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'admin@medixpro.com';
    const password = 'password123';

    console.log('Finding user...');
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user?.email);

    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('Comparing password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return;
    }

    console.log('Generating token...');
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log('Login successful!');
    console.log('Token:', token);
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
