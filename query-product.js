const { PrismaClient } = require('@prisma/client');

// DATABASE_URL is read from the environment (.env)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "mysql://3z52LRpdPAtCvCS.root:K0Ggvhr30tVRMO3w@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict";
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
