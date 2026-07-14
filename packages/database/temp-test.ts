import { prisma } from './index';

async function test() {
  const where = {
    isActive: true,
    AND: [
      {
        OR: [
          { category: { slug: 'women' } },
          { category: { parent: { slug: 'women' } } }
        ]
      }
    ]
  };

  console.log("Input WHERE:", JSON.stringify(where, null, 2));

  // Let's resolve it manually to see if it resolves correctly
  const client = (prisma as any).$client || (prisma as any)._client || require('./index').db;
  
  const products = await prisma.product.findMany({
    where,
    take: 12
  });

  console.log("Fetched products count:", products.length);
  console.log("Sample products:", products.map(p => ({ id: p.id, name: p.name, categoryId: p.categoryId })));
}

test()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
