import { prisma } from './index.ts';

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      images: true,
    }
  });
  console.log('PRODUCTS IN DB:', JSON.stringify(products, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
