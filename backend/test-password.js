const bcrypt = require('bcryptjs');

async function testPassword() {
  const hashedPassword = '$2a$10$e.uy5O5tofvgg4puGyqekeCoJtHJMFy.dafZRNYOD0VeFzkyegk2q';
  const plainPassword = 'password123';

  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password valid:', isValid);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPassword();
