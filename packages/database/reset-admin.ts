import { prisma } from './index';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@bigbazar.com';
  const password = 'admin123';

  // Delete existing admin
  await prisma.user.deleteMany({
    where: { email }
  });

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      email,
      name: 'Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`✅ Admin user reset: ${admin.email} (role: ${admin.role})`);
  console.log('Password:', password);
}

main()
  .catch((e) => {
    console.error('Error resetting admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
