const { PrismaClient } = require('@prisma/client');

// DATABASE_URL is read from the environment (.env)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "mysql://avnadmin:PLACEHOLDER@bigbazarbd-bigbazar.d.aivencloud.com:20105/defaultdb?sslmode=REQUIRED";
}

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      slug: 'exclusive-eid-collection-pharshi--c77192'
    },
    include: {
      category: true,
      reviews: true
    }
  });
  console.log('PRODUCT_JSON_START');
  console.log(JSON.stringify(product, null, 2));
  console.log('PRODUCT_JSON_END');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
