import { Product } from '@/types/product';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'Monochrome Essential Tee',
        slug: 'monochrome-essential-tee',
        description: 'The cornerstone of any modern wardrobe. Crafted from 220GSM organic cotton for a structured yet soft feel. Features a reinforced collar and a relaxed industrial fit.',
        shortDescription: 'Premium 220GSM organic cotton tee.',
        basePrice: 2400,
        salePrice: 1800,
        category: 'Men',
        brand: 'Curator',
        sku: 'TSH-001',
        stock: 50,
        images: [
            { id: 'i1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', isMain: true },
            { id: 'i2', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop', isMain: false }
        ],
        rating: 4.9,
        reviewCount: 342,
        isFeatured: true,
        isNew: true,
        tags: ['minimalist', 'basics', 'cotton'],
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
        status: 'active'
    },
    {
        id: 'p2',
        name: 'Raw Denim Curation Jacket',
        slug: 'raw-denim-curation-jacket',
        description: 'Unwashed 14oz Japanese selvedge denim. This artifact will evolve with you, developing unique fades and character over time. Triple-needle stitched for maximum durability.',
        shortDescription: '14oz Japanese selvedge denim jacket.',
        basePrice: 12500,
        category: 'Men',
        brand: 'Industrial',
        sku: 'JKT-002',
        stock: 15,
        images: [
            { id: 'i3', url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=800&auto=format&fit=crop', isMain: true }
        ],
        rating: 4.8,
        reviewCount: 89,
        isFeatured: true,
        isNew: false,
        tags: ['denim', 'outerwear', 'selvedge'],
        createdAt: '2026-01-05T00:00:00Z',
        updatedAt: '2026-01-05T00:00:00Z',
        status: 'active'
    },
    {
        id: 'p3',
        name: 'Silk Flow Midi Dress',
        slug: 'silk-flow-midi-dress',
        description: 'A manifestation of elegance. Pure mulberry silk that drapes effortlessly. Designed with a subtle industrial sheen and minimalist lines for the modern curator.',
        shortDescription: 'Pure mulberry silk midi dress.',
        basePrice: 15800,
        salePrice: 12500,
        category: 'Women',
        brand: 'Manifest',
        sku: 'DRS-003',
        stock: 12,
        images: [
            { id: 'i4', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', isMain: true }
        ],
        rating: 4.7,
        reviewCount: 156,
        isFeatured: true,
        isNew: true,
        tags: ['silk', 'elegant', 'midi'],
        createdAt: '2026-02-10T00:00:00Z',
        updatedAt: '2026-02-10T00:00:00Z',
        status: 'active'
    },
    {
        id: 'p4',
        name: 'Structured Wool Overcoat',
        slug: 'structured-wool-overcoat',
        description: 'Heavyweight Melton wool construction. Featuring architectural shoulders and a deep obsidian finish. The ultimate external layer for cold-climate synchronization.',
        shortDescription: 'Heavyweight Melton wool overcoat.',
        basePrice: 28000,
        category: 'Women',
        brand: 'Curator',
        sku: 'COA-004',
        stock: 10,
        images: [
            { id: 'i5', url: 'https://images.unsplash.com/photo-1539533377285-b31421a7a99b?q=80&w=800&auto=format&fit=crop', isMain: true }
        ],
        rating: 5.0,
        reviewCount: 45,
        isFeatured: true,
        isNew: true,
        tags: ['wool', 'outerwear', 'winter'],
        createdAt: '2026-03-01T00:00:00Z',
        updatedAt: '2026-03-01T00:00:00Z',
        status: 'active'
    }
];

// Helper for generating more mock data
const generateMoreProducts = () => {
    const categories = ['New Arrivals', 'Men', 'Women', 'kid(boys)', 'kids(girls)', 'Sale'];
    const subcats = {
        'Men': ['T-Shirts', 'Denim', 'Knitwear', 'Outerwear'],
        'Women': ['Dresses', 'Blouses', 'Trousers', 'Skirts'],
        'kid(boys)': ['T-Shirts', 'Pants', 'Sets'],
        'kids(girls)': ['Dresses', 'Tops', 'Skirts'],
        'New Arrivals': ['Spring Edit', 'Summer Drop'],
        'Sale': ['Last Chance', 'Seasonal Clearance']
    };
    const brands = ['Curator', 'Manifest', 'Industrial', 'Nexus', 'Prime', 'Alpha'];
    
    for (let i = 5; i <= 30; i++) {
        const cat = categories[i % categories.length];
        const categorySubs = subcats[cat as keyof typeof subcats];
        const sub = categorySubs[i % categorySubs.length];
        MOCK_PRODUCTS.push({
            id: `p${i}`,
            name: `${brands[i % brands.length]} ${sub} Artifact #${i}`,
            slug: `${brands[i % brands.length].toLowerCase()}-${sub.toLowerCase()}-artifact-${i}`,
            description: `A premium garment from our ${cat} collection. This ${sub} piece is designed for maximum versatility and industrial longevity.`,
            shortDescription: `Curated ${sub} essential.`,
            basePrice: 1500 + (i * 200),
            category: cat,
            brand: brands[i % brands.length],
            sku: `${cat.substring(0, 3).toUpperCase()}-${i.toString().padStart(3, '0')}`,
            stock: 5 + (i % 20),
            images: [
                { id: `i${i}`, url: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?q=80&w=800&auto=format&fit=crop`, isMain: true }
            ],
            rating: 4.0 + (i % 10) / 10,
            reviewCount: i * 8,
            isFeatured: i % 4 === 0,
            isNew: i % 3 === 0,
            tags: [cat.toLowerCase(), sub.toLowerCase(), 'curated'],
            createdAt: '2026-04-01T00:00:00Z',
            updatedAt: '2026-04-01T00:00:00Z',
            status: 'active'
        });
    }
};

generateMoreProducts();
