import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriesToSeed = [
  {
    name: 'Men',
    slug: 'men',
    subcategories: ['T-Shirts', 'Denim', 'Knitwear', 'Outerwear']
  },
  {
    name: 'Women',
    slug: 'women',
    subcategories: ['Dresses', 'Blouses', 'Trousers', 'Skirts']
  },
  {
    name: 'Kids(Boys)',
    slug: 'kids-boys',
    subcategories: ['T-Shirts', 'Pants', 'Outerwear']
  },
  {
    name: 'Kids(Girls)',
    slug: 'kids-girls',
    subcategories: ['Dresses', 'Tops', 'Skirts']
  },
  {
    name: 'Wedding Touch',
    slug: 'wedding-touch',
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
            slug: group.slug
          }
        });
      console.log(`Created parent: ${parent.name}`);
    } else {
      console.log(`Parent exists: ${parent.name}`);
    }

    for (const sub of group.subcategories) {
      const subSlug = `${group.slug}-${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      
      const existingSub = await prisma.category.findUnique({ where: { slug: subSlug } });
      
      if (!existingSub) {
        await prisma.category.create({
          data: {
            name: sub,
            slug: subSlug,
            parentId: parent.id
          }
        });
        console.log(`  Created subcategory: ${sub}`);
      } else {
        console.log(`  Subcategory exists: ${sub}`);
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
