require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const YEAR = '2026';
const ROLE_PREFIX = {
  ADMIN: 'ADM',
  DIRECTOR: 'DIR',
  COLLECTOR: 'COL',
  HOMEOWNER: 'HOM',
  TENANT: 'TEN',
};

function genId(prefix, seq) {
  return `${prefix}-${YEAR}-${String(seq).padStart(4, '0')}`;
}

function randomPassword(len = 8) {
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

async function createUser({ seq, role, firstName, lastName, email }) {
  const prefix = ROLE_PREFIX[role];
  const id = genId(prefix, seq);
  const rawPassword = randomPassword(8);
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  // Use upsert to safely handle records that already exist
  const user = await prisma.user.upsert({
    where: { id },
    update: {
      firstName,
      lastName,
      email,
      systemRole: role,
    },
    create: {
      id,
      firstName,
      lastName,
      email,
      phoneNumber: '0000000000',
      dateOfBirth: new Date('1990-01-01'),
      passwordHash,
      systemRole: role,
      accountStatus: 'ACTIVE',
    },
  });

  console.log(`${role} processed: ${email} -> password: ${rawPassword}`);
  return user;
}

async function main() {
  console.log('Seeding initial users...');

  await createUser({ seq: 1, role: 'ADMIN', firstName: 'Zone', lastName: 'Admin', email: 'admin@zoneguard.local' });
  await createUser({ seq: 1, role: 'DIRECTOR', firstName: 'District', lastName: 'Director', email: 'director@zoneguard.local' });
  await createUser({ seq: 1, role: 'COLLECTOR', firstName: 'Collection', lastName: 'Agent', email: 'collector@zoneguard.local' });
  await createUser({ seq: 1, role: 'HOMEOWNER', firstName: 'Home', lastName: 'Owner', email: 'homeowner@zoneguard.local' });
  await createUser({ seq: 1, role: 'TENANT', firstName: 'Tenant', lastName: 'Resident', email: 'tenant@zoneguard.local' });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });