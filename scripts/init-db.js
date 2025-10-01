const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.ntqronyjnvuvqhbhpudn',
  password: 'RbUL1wu88gGuuDJ',
  ssl: {
    rejectUnauthorized: false
  }
};

const pool = new Pool(dbConfig);

async function initDatabase() {
  console.log('Initializing MySanta database...');
  
  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully!');
    
    // Create a test user for development
    const testUserQuery = `
      INSERT INTO users (id, name, email, hashed_password, dob, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `;
    
    await pool.query(testUserQuery, [
      'test-user-1',
      'Test User',
      'test@example.com',
      '$2a$12$VQ5HgWm34QG5rCKZP5pr2uHZlI1Kn1K7mWqFR.lTAHzBGKJKcBfuS', // password: "password123"
      '1990-01-01',
      'USER'
    ]);
    
    console.log('✅ Test user created (email: test@example.com, password: password123)');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the initialization
initDatabase();