import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.product.findFirst({ where: { name: 'Baishakhi Sadi' } }).then(console.log).finally(() => prisma.$disconnect());
