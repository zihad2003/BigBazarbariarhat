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
    // Fetch all homepage dynamic content in parallel directly from the database
    const [dbNewProducts, dbFeaturedProducts, dbCategories, dbHeroBanners, dbSecondaryBanners] = await Promise.all([
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

    // Map database models to plain JS/JSON serializable types
    const newArrivals = dbNewProducts.map((p) => ({
        ...p,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category ? {
            ...p.category,
            createdAt: p.category.createdAt.toISOString(),
            updatedAt: p.category.updatedAt.toISOString(),
        } : null,
    }));

    const flashProducts = dbFeaturedProducts.map((p) => ({
        ...p,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category ? {
            ...p.category,
            createdAt: p.category.createdAt.toISOString(),
            updatedAt: p.category.updatedAt.toISOString(),
        } : null,
    }));

    const categories = dbCategories
        .map((cat) => ({
            key: cat.slug,
            name: cat.name,
            href: `/products?category=${encodeURIComponent(cat.slug)}`,
            image: cat.image || fallbackCategoryImages[cat.name] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop',
            comingSoon: false,
            count: cat._count?.products || 0,
        }));

    const heroBanners = dbHeroBanners.map(b => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
    }));

    const promoBanners = dbSecondaryBanners.map(b => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
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
