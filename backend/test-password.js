const bcrypt = require('bcryptjs');

async function test() {
  const hash = '$2a$10$5kbJLwZ5l3VvEwphKeBw.ugJIA2dOIFIGJCN.JWoyvNFqBT3UJ6.u';
  const password = 'password123';
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password valid:', isValid);
}

test();
