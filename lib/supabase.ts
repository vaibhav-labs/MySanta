
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials for private repo
const DB_CONFIG = {
  host: 'db.mcrtfnbnzincuihnyxfo.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'ThisismySupabasepassword@123',
  ssl: {
    rejectUnauthorized: false
  }
};

// Create PostgreSQL connection pool
export const pgPool = new Pool(DB_CONFIG);


// Supabase URL and anon key (these can be public as they're meant to be used client-side with RLS)
const SUPABASE_URL = `https://mcrtfnbnzincuihnyxfo.supabase.co`;
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jcnRmbmJuemluY3VpaG55eGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDQ2NTgsImV4cCI6MjA3NDg4MDY1OH0.wEmJG0w3sQW7OdRFpNiDvdxupTfjSbPemmM2xYDuOss'; // You'll need to get this from your Supabasedashboard

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to execute queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const result = await pgPool.query(sql, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to execute single row queries
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

// Helper function for transactions
export async function transaction<T = any>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pgPool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}