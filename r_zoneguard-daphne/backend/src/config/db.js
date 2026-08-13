<<<<<<< HEAD
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Add a PostgreSQL connection string to your .env file before starting the server.'
  );
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__zoneGuardPrisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__zoneGuardPrisma = prisma;
}

module.exports = prisma;
=======
const { Pool } = require('pg');
require('dotenv').config();

// Supports either a single DATABASE_URL or discrete PG* env vars.
const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });

module.exports = pool;
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
