// prisma/seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.SEED_ADMIN_PASS || 'Passw0rd!';
  const patientEmail = process.env.SEED_PATIENT_EMAIL || 'patient@example.com';
  const patientPass = process.env.SEED_PATIENT_PASS || 'Passw0rd!';

  try {
    const admin = await prisma.user.findUnique({ where: { email: adminEmail }});
    if (!admin) {
      await prisma.user.create({
        data: {
          name: 'Admin',
          email: adminEmail,
          passwordHash: await bcrypt.hash(adminPass, 10),
          role: 'admin'
        }
      });
      console.log('Created admin:', adminEmail);
    }

    const patient = await prisma.user.findUnique({ where: { email: patientEmail }});
    if (!patient) {
      await prisma.user.create({
        data: {
          name: 'Patient',
          email: patientEmail,
          passwordHash: await bcrypt.hash(patientPass, 10),
          role: 'patient'
        }
      });
      console.log('Created patient:', patientEmail);
    }
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  // run when executed directly
  seed().then(() => process.exit(0));
} else {
  module.exports = seed;
}
