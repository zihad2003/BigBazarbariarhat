import { prisma } from './index';

const categoriesToSeed = [
  {
    name: 'Men',
    slug: 'men',
    displayOrder: 1,
    subcategories: ['T-Shirts', 'Denim', 'Knitwear', 'Outerwear']
  },
  {
    name: 'Women',
    slug: 'women',
    displayOrder: 2,
    subcategories: ['Dresses', 'Blouses', 'Trousers', 'Skirts']
  },
  {
    name: 'Kids(Boys)',
    slug: 'kids-boys',
    displayOrder: 3,
    subcategories: ['T-Shirts', 'Pants', 'Outerwear']
  },
  {
    name: 'Kids(Girls)',
    slug: 'kids-girls',
    displayOrder: 4,
    subcategories: ['Dresses', 'Tops', 'Skirts']
  },
  {
    name: 'Wedding Touch',
    slug: 'wedding-touch',
    displayOrder: 5,
    subcategories: ['Panjabi', 'Sherwani', 'Saree']
  }
];

async function main() {
  console.log('Seeding categories...');
  
  for (const group of categoriesToSeed) {
    // Check if parent exists
    let parent = await prisma.category.findUnique({ where: { slug: group.slug } });
    
    if (!parent) {
        parent = await prisma.category.create({
          data: {
            name: group.name,
            slug: group.slug,
            displayOrder: group.displayOrder,
          }
        });
      console.log(`Created parent: ${parent.name} (order: ${group.displayOrder})`);
    } else {
      // Update displayOrder if parent already exists
      parent = await prisma.category.update({
        where: { id: parent.id },
        data: { displayOrder: group.displayOrder }
      });
      console.log(`Parent exists: ${parent.name} (updated order: ${group.displayOrder})`);
    }

    for (let i = 0; i < group.subcategories.length; i++) {
      const sub = group.subcategories[i];
      const subSlug = `${group.slug}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      
      const existingSub = await prisma.category.findUnique({ where: { slug: subSlug } });
      
      if (!existingSub) {
        await prisma.category.create({
          data: {
            name: sub,
            slug: subSlug,
            parentId: parent.id,
            displayOrder: i + 1,
          }
        });
        console.log(`  Created subcategory: ${sub} (order: ${i + 1})`);
      } else {
        await prisma.category.update({
          where: { id: existingSub.id },
          data: { displayOrder: i + 1 }
        });
        console.log(`  Subcategory exists: ${sub} (updated order: ${i + 1})`);
      }
    }
  }
  
  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
