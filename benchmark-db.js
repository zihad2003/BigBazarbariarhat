const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('Database URL Host:', process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).host : 'not set');
  console.log('Starting DB benchmark...\n');

  // Measure connection time
  const connectStart = Date.now();
  await prisma.$connect();
  const connectEnd = Date.now();
  console.log(`Prisma $connect() took: ${connectEnd - connectStart}ms`);

  // Run 1: Simple count
  const start1 = Date.now();
  const count = await prisma.product.count();
  const end1 = Date.now();
  console.log(`Query 1 (product count = ${count}) took: ${end1 - start1}ms`);

  // Run 2: Simple select
  const start2 = Date.now();
  const first = await prisma.product.findFirst();
  const end2 = Date.now();
  console.log(`Query 2 (findFirst product) took: ${end2 - start2}ms`);

  // Run 3: Parallel queries (like in dashboard route)
  const start3 = Date.now();
  const [totalSales, totalOrders, totalProducts, totalCustomers] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'DELIVERED' }
    }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: 'USER' } })
  ]);
  const end3 = Date.now();
  console.log(`Query 3 (4 concurrent counts/sums) took: ${end3 - start3}ms`);

  // Run 4: Query with include (orders list)
  const start4 = Date.now();
  const orders = await prisma.order.findMany({
    take: 10,
    include: { 
      user: { select: { name: true, email: true } },
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  const end4 = Date.now();
  console.log(`Query 4 (10 orders with user/items/products) took: ${end4 - start4}ms`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\nDone.');
  });
