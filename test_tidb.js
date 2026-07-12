const { Connection } = require('@tidbcloud/serverless');
const { PrismaTiDBCloud } = require('@tidbcloud/prisma-adapter');
const { PrismaClient } = require('@prisma/client');

const url = "mysql://3z52LRpdPAtCvCS.root:K0Ggvhr30tVRMO3w@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict";

async function testRaw() {
  console.log("Testing raw connection using @tidbcloud/serverless...");
  try {
    const conn = new Connection({ url });
    const result = await conn.execute("SELECT 1");
    console.log("Raw connection successful! Result:", result);
  } catch (err) {
    console.error("Raw connection failed:", err);
  }
}

async function testPrisma() {
  console.log("Testing connection using @tidbcloud/prisma-adapter...");
  try {
    const adapter = new PrismaTiDBCloud({ url });
    const prisma = new PrismaClient({ adapter });
    const result = await prisma.storeSetting.findFirst();
    console.log("Prisma connection successful! Setting:", result);
  } catch (err) {
    console.error("Prisma connection failed:", err);
  }
}

async function main() {
  await testRaw();
  await testPrisma();
}

main();
