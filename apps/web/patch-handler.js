const fs = require('fs');
const path = require('path');

const handlerPath = path.join(__dirname, '.open-next/server-functions/default/apps/web/handler.mjs');

if (!fs.existsSync(handlerPath)) {
  console.log('handler.mjs not found, skipping patch.');
  process.exit(0);
}

let content = fs.readFileSync(handlerPath, 'utf8');

// Regex to match the absolute or mangled import paths for query_engine_bg wasm files
const regex = /import\("[^"]+?query_engine[^"]+?\.wasm"\)/g;

const matches = content.match(regex);
if (matches) {
  console.log('Found matches to patch:', matches);
  content = content.replace(regex, 'import("../../node_modules/.prisma/client/query_engine_bg.wasm")');
  fs.writeFileSync(handlerPath, content, 'utf8');
  console.log('Successfully patched handler.mjs paths with relative WASM imports.');
} else {
  console.log('No matches found to patch in handler.mjs.');
}
