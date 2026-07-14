const { connect } = require('@tidbcloud/serverless');

const url = "mysql://3z52LRpdPAtCvCS.root:K0Ggvhr30tVRMO3w@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict";

async function main() {
  console.log("Connecting...");
  const conn = connect({ url });
  
  console.log("Querying Category...");
  const categories = await conn.execute("SELECT * FROM Category WHERE name = 'Women'");
  console.log("Categories found:", categories);

  if (categories && categories.length > 0) {
    const products = await conn.execute("SELECT id, name, slug, images FROM Product WHERE name LIKE '%3 piece%' OR name LIKE '%Sadi Collection%'");
    console.log("Matching products in DB:\n", JSON.stringify(products, null, 2));
  } else {
    console.log("Category 'Women' not found in database.");
  }
}

main()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
