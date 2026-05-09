import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // List ALL categories (including children)
  const all = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true, children: true } } }
  });
  
  console.log(`\nTotal categories in DB: ${all.length}\n`);
  console.log('ID | Name | Slug | ParentId | DisplayOrder | Products | Children');
  console.log('-'.repeat(120));
  
  for (const cat of all) {
    console.log(`${cat.id} | ${cat.name} | ${cat.slug} | ${cat.parentId || 'NULL'} | ${cat.displayOrder} | ${cat._count.products} | ${cat._count.children}`);
  }

  // Check for duplicates
  const parentCats = all.filter(c => !c.parentId);
  console.log(`\nTop-level categories: ${parentCats.length}`);
  parentCats.forEach(c => console.log(`  - ${c.name} (slug: ${c.slug}, order: ${c.displayOrder})`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
