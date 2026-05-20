/**
 * Seed script: creates the initial SUPER_ADMIN user.
 * Run with: npx ts-node packages/database/seed-admin.ts
 *
 * Credentials are read from environment variables:
 *   ADMIN_EMAIL    (default: admin@bigbazar.com)
 *   ADMIN_PASSWORD (required — no default for security)
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@bigbazar.com';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      'ADMIN_PASSWORD environment variable is required.\n' +
      'Usage: ADMIN_PASSWORD=yourpassword npx ts-node packages/database/seed-admin.ts'
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    console.log('To reset the password, delete the user and re-run this script.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      email,
      name: 'Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`✅ Admin user created: ${admin.email} (role: ${admin.role})`);
  console.log('You can now log in to the admin panel with these credentials.');
}

main()
  .catch((e) => {
    console.error('Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
