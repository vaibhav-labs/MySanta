const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET');

    const client = await pool.connect();
    console.log('✓ Successfully connected to database');

    // Test query
    const result = await client.query('SELECT COUNT(*) FROM users');
    console.log('✓ Users table accessible. Count:', result.rows[0].count);

    // Check tables exist
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('\n✓ Available tables:');
    tables.rows.forEach(row => console.log('  -', row.table_name));

    client.release();

    // Test creating a user
    console.log('\n\nTesting user creation...');
    const testUser = await pool.query(
      `INSERT INTO users (email, name, hashed_password, dob, gender)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      ['test_' + Date.now() + '@test.com', 'Test User', 'hashedpass123', '1990-01-01', 'other']
    );

    console.log('✓ User created successfully:', testUser.rows[0].email);

    // Clean up test user
    await pool.query('DELETE FROM users WHERE id = $1', [testUser.rows[0].id]);
    console.log('✓ Test user cleaned up');

    await pool.end();
    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
