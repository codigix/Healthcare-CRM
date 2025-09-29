const { testConnection, initializeDatabase } = require('./config/database');

async function setupDatabase() {
  console.log('🚀 Setting up Healthcare CRM Database...\n');
  
  try {
    // Test connection
    await testConnection();
    
    // Initialize tables and data
    await initializeDatabase();
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📋 Default credentials:');
    console.log('   Email: admin@hospital.com');
    console.log('   Password: admin123');
    console.log('\n🎉 You can now start the server with: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    console.log('\n🔧 Please check your database configuration and try again.');
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
