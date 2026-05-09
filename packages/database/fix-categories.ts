import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Hide the "Uncategorized" category from storefront navigation
  const uncategorized = await prisma.category.findUnique({ where: { slug: 'uncategorized' } });
  if (uncategorized) {
    await prisma.category.update({
      where: { id: uncategorized.id },
      data: { isHidden: true, displayOrder: 99 }
    });
    console.log('✓ Hidden "Uncategorized" from storefront navigation');
  }

  // Hide stray "Mens Jackets" subcategory (orphan with displayOrder 0)
  const mensJackets = await prisma.category.findUnique({ where: { slug: 'mens-jackets' } });
  if (mensJackets) {
    await prisma.category.update({
      where: { id: mensJackets.id },
      data: { isHidden: true }
    });
    console.log('✓ Hidden stray "Mens Jackets" subcategory');
  }

  console.log('\nCleanup complete! Navigation should now show: Men, Women, Kids(Boys), Kids(Girls), Wedding Touch');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
