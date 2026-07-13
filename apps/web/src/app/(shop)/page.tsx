import { prisma } from '@bigbazar/db';
import HomeClient from './HomeClient';

// Server-side fallback category images
const fallbackCategoryImages: Record<string, string> = {
    'Women': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop',
    'Men': 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=500&auto=format&fit=crop',
    'Kids(Boys)': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=500&auto=format&fit=crop',
    'Kids(Girls)': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=500&auto=format&fit=crop',
    'Wedding Touch': 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=500&auto=format&fit=crop',
};


export const revalidate = 60; // Revalidate dynamic home page content every 60 seconds

export default async function HomePage() {
    // Mock data for frontend preview without database
    const mockProducts = [
        { id: '1', name: 'Classic White Shirt', slug: 'classic-white-shirt', price: 1200, salePrice: 950, sku: 'SHIRT001', stock: 50, isActive: true, featured: true, isSale: true, isHot: false, isNew: true, categoryId: '1', category: { id: '1', name: 'Men', slug: 'men' }, images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop', isFeatured: true }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '2', name: 'Floral Summer Dress', slug: 'floral-summer-dress', price: 2500, salePrice: null, sku: 'DRESS001', stock: 30, isActive: true, featured: true, isSale: false, isHot: true, isNew: false, categoryId: '2', category: { id: '2', name: 'Women', slug: 'women' }, images: [{ url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop', isFeatured: true }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '3', name: 'Denim Jacket', slug: 'denim-jacket', price: 3500, salePrice: 2800, sku: 'JACKET001', stock: 25, isActive: true, featured: true, isSale: true, isHot: false, isNew: false, categoryId: '1', category: { id: '1', name: 'Men', slug: 'men' }, images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop', isFeatured: true }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '4', name: 'Kids Casual Set', slug: 'kids-casual-set', price: 800, salePrice: null, sku: 'KIDS001', stock: 40, isActive: true, featured: false, isSale: false, isHot: false, isNew: true, categoryId: '3', category: { id: '3', name: 'Kids(Boys)', slug: 'kids-boys' }, images: [{ url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&auto=format&fit=crop', isFeatured: true }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '5', name: 'Elegant Blouse', slug: 'elegant-blouse', price: 1500, salePrice: 1200, sku: 'BLOUSE001', stock: 35, isActive: true, featured: true, isSale: true, isHot: false, isNew: false, categoryId: '2', category: { id: '2', name: 'Women', slug: 'women' }, images: [{ url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=500&auto=format&fit=crop', isFeatured: true }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    const mockCategories = [
        { key: 'men', name: 'Men', href: '/products?category=men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=500&auto=format&fit=crop', comingSoon: false, count: 25 },
        { key: 'women', name: 'Women', href: '/products?category=women', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop', comingSoon: false, count: 42 },
        { key: 'kids-boys', name: 'Kids(Boys)', href: '/products?category=kids-boys', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&auto=format&fit=crop', comingSoon: false, count: 18 },
        { key: 'kids-girls', name: 'Kids(Girls)', href: '/products?category=kids-girls', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&auto=format&fit=crop', comingSoon: false, count: 22 },
        { key: 'wedding', name: 'Wedding Touch', href: '/products?category=wedding', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&auto=format&fit=crop', comingSoon: false, count: 15 },
    ];

    const mockHeroBanners = [
        { id: '1', title: 'Summer Collection 2024', subtitle: 'Up to 50% off on selected items', imageDesktop: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&auto=format&fit=crop', linkUrl: '/products', linkText: 'Shop Now', position: 'HOME_HERO', displayOrder: 0, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    const mockPromoBanners = [
        { id: '2', title: 'Flash Sale', subtitle: 'Limited time offers', imageDesktop: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&auto=format&fit=crop', linkUrl: '/products?onSale=true', linkText: 'View Deals', position: 'HOME_SECONDARY', displayOrder: 0, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    let dbNewProducts: any[] = [];
    let dbFeaturedProducts: any[] = [];
    let dbCategories: any[] = [];
    let dbHeroBanners: any[] = [];
    let dbSecondaryBanners: any[] = [];

    try {
        // Fetch all homepage dynamic content in parallel directly from the database
        [dbNewProducts, dbFeaturedProducts, dbCategories, dbHeroBanners, dbSecondaryBanners] = await Promise.all([
            prisma.product.findMany({
                where: { isActive: true },
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                take: 8,
            }),
            prisma.product.findMany({
                where: {
                    featured: true,
                    isActive: true
                },
                take: 5,
                include: { category: true }
            }),
            prisma.category.findMany({
                where: {
                    parentId: null,
                    isHidden: false,
                },
                include: {
                    _count: { select: { products: true } }
                },
                orderBy: { displayOrder: 'asc' }
            }),
            prisma.banner.findMany({
                where: {
                    position: 'HOME_HERO',
                    isActive: true,
                },
                orderBy: { displayOrder: 'asc' },
            }),
            prisma.banner.findMany({
                where: {
                    position: 'HOME_SECONDARY',
                    isActive: true,
                },
                orderBy: { displayOrder: 'asc' },
            }),
        ]);
    } catch (error) {
        console.log('Database connection failed, using mock data for preview');
        dbNewProducts = mockProducts;
        dbFeaturedProducts = mockProducts.filter(p => p.featured);
        dbCategories = mockCategories;
        dbHeroBanners = mockHeroBanners;
        dbSecondaryBanners = mockPromoBanners;
    }

    // Map database models to plain JS/JSON serializable types
     const newArrivals = dbNewProducts.map((p) => {
        const cat = p.category as any;
        return {
            ...p,
            price: typeof p.price === 'string' ? Number(p.price) : p.price,
            salePrice: p.salePrice ? (typeof p.salePrice === 'string' ? Number(p.salePrice) : p.salePrice) : null,
            createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
            updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
            category: cat ? {
                ...cat,
                createdAt: cat.createdAt instanceof Date ? cat.createdAt.toISOString() : cat.createdAt,
                updatedAt: cat.updatedAt instanceof Date ? cat.updatedAt.toISOString() : cat.updatedAt,
            } : null,
        };
    });

    const flashProducts = dbFeaturedProducts.map((p) => {
        const cat = p.category as any;
        return {
            ...p,
            price: typeof p.price === 'string' ? Number(p.price) : p.price,
            salePrice: p.salePrice ? (typeof p.salePrice === 'string' ? Number(p.salePrice) : p.salePrice) : null,
            createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
            updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
            category: cat ? {
                ...cat,
                createdAt: cat.createdAt instanceof Date ? cat.createdAt.toISOString() : cat.createdAt,
                updatedAt: cat.updatedAt instanceof Date ? cat.updatedAt.toISOString() : cat.updatedAt,
            } : null,
        };
    });

    const categories = dbCategories
        .map((cat: any) => ({
            key: cat.slug || cat.key,
            name: cat.name,
            href: cat.href || `/products?category=${encodeURIComponent(cat.slug || cat.key)}`,
            image: cat.image || fallbackCategoryImages[cat.name] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop',
            comingSoon: cat.comingSoon || false,
            count: cat._count?.products || cat.count || 0,
        }));

    const heroBanners = dbHeroBanners.map(b => ({
        ...b,
        createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
        updatedAt: b.updatedAt instanceof Date ? b.updatedAt.toISOString() : b.updatedAt,
    }));

    const promoBanners = dbSecondaryBanners.map(b => ({
        ...b,
        createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
        updatedAt: b.updatedAt instanceof Date ? b.updatedAt.toISOString() : b.updatedAt,
    }));

    return (
        <HomeClient
            newArrivals={newArrivals}
            flashProducts={flashProducts}
            categories={categories}
            heroBanners={heroBanners}
            promoBanners={promoBanners}
        />
    );
}
