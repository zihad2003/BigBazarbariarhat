import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1y_FEQV3AS66c26UZrHb2wBC2dcGX0kxXA1h6knxNgTc/export?format=csv&gid=776167565';

function parseCSV(text: string) {
    const result = [];
    let row = [];
    let inQuotes = false;
    let val = '';
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let nextChar = text[i + 1];
        
        if (inQuotes) {
            if (char === '"') {
                if (nextChar === '"') { val += '"'; i++; }
                else { inQuotes = false; }
            } else { val += char; }
        } else {
            if (char === '"') { inQuotes = true; }
            else if (char === ',') { row.push(val); val = ''; }
            else if (char === '\n' || char === '\r') {
                if (char === '\r' && nextChar === '\n') i++;
                row.push(val); val = '';
                if (row.length > 1 || row[0] !== '') result.push(row);
                row = [];
            } else { val += char; }
        }
    }
    if (val !== '' || row.length > 0) { row.push(val); result.push(row); }
    
    if (result.length === 0) return [];
    
    const headers = result[0];
    const objects = [];
    for (let i = 1; i < result.length; i++) {
        const currentLine = result[i];
        const obj: any = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j] || null;
        }
        objects.push(obj);
    }
    return objects;
}

async function main() {
    console.log('Fetching data from Google Sheets...');
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    console.log(`Found ${rows.length} products to import.`);

    for (const row of rows) {
        if (!row.id) continue;
        
        console.log(`Importing: ${row.name}`);

        // 1. Ensure Category exists
        let categoryId = null;
        if (row.category) {
            const catSlug = row.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            let category = await prisma.category.findUnique({ where: { slug: catSlug } });
            
            if (!category) {
                category = await prisma.category.create({
                    data: {
                        name: row.category,
                        slug: catSlug
                    }
                });
                console.log(`  -> Created Category: ${row.category}`);
            }
            categoryId = category.id;
        }

        if (!categoryId) {
            console.log(`  -> Skipping due to missing category`);
            continue;
        }

        // 2. Parse JSON fields safely
        let variants: any[] = [];
        let images: any[] = [];
        try { if (row.available_sizes) variants.push(...JSON.parse(row.available_sizes.replace(/""/g, '"'))); } catch (e) {}
        try { if (row.available_colors) variants.push(...JSON.parse(row.available_colors.replace(/""/g, '"'))); } catch (e) {}
        try { 
            if (row.images) {
                const parsedImages = JSON.parse(row.images.replace(/""/g, '"'));
                if (Array.isArray(parsedImages)) {
                    images = parsedImages.map((url, idx) => ({
                        id: `img-${row.id.substring(0, 8)}-${idx}`,
                        url: url,
                        isMain: idx === 0
                    }));
                }
            }
        } catch (e) {}

        const sku = row.id.substring(0, 8); // simplified sku

        // 3. Upsert Product
        await prisma.product.upsert({
            where: { originalId: row.id },
            update: {
                name: row.name,
                description: row.description,
                price: row.original_price ? (parseFloat(row.original_price) || 0) : (parseFloat(row.price) || 0),
                salePrice: row.original_price ? (parseFloat(row.price) || null) : null,
                stock: parseInt(row.stock_count, 10) || 0,
                images: images,
                instagramReelUrl: row.video_url,
                category: { connect: { id: categoryId } },
                isActive: row.status === 'published',
                featured: row.is_exclusive === '1',
                isSale: row.is_sale === '1',
                isHot: row.is_hot === '1',
                isNew: row.is_new === '1',
                variants: variants
            },
            create: {
                originalId: row.id,
                name: row.name,
                slug: `${row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${row.id.substring(0, 6)}`,
                description: row.description,
                price: row.original_price ? (parseFloat(row.original_price) || 0) : (parseFloat(row.price) || 0),
                salePrice: row.original_price ? (parseFloat(row.price) || null) : null,
                sku: sku,
                stock: parseInt(row.stock_count, 10) || 0,
                images: images,
                instagramReelUrl: row.video_url,
                category: { connect: { id: categoryId } },
                isActive: row.status === 'published',
                featured: row.is_exclusive === '1',
                isSale: row.is_sale === '1',
                isHot: row.is_hot === '1',
                isNew: row.is_new === '1',
                variants: variants
            }
        });
    }

    console.log('Import completed successfully!');
}

main()
  .catch(e => {
    console.error('Error importing:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
