require('dotenv').config();

module.exports = {
  migrations: {
    seed: 'node ./prisma/seed.js', // Added leading dot-slash
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};