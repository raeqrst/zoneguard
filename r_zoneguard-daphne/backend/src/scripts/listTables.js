require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/zoneguard_db?schema=public';

async function listTables() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;`
    );
    if (res.rows.length === 0) {
      console.log('No tables found in schema public.');
    } else {
      console.log('Tables in public schema:');
      res.rows.forEach((r) => console.log('- ' + r.table_name));
    }
  } catch (err) {
    console.error('Error listing tables:', err.message || err);
  } finally {
    await client.end();
  }
}

listTables();
