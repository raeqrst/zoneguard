require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/zoneguard_db?schema=public';

async function showMigrations() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query(`SELECT id, migration_name, started_at, finished_at, applied_steps_count FROM _prisma_migrations ORDER BY started_at;`);
    if (res.rows.length === 0) {
      console.log('No rows in _prisma_migrations');
    } else {
      console.log('Rows in _prisma_migrations:');
      res.rows.forEach(r => console.log(r));
    }
  } catch (err) {
    console.error('Error querying _prisma_migrations:', err.message || err);
  } finally {
    await client.end();
  }
}

showMigrations();
