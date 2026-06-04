import { prisma } from '@bigbazar/db';
import ShopClient from './ShopClient';

export const revalidate = 60; // Revalidate page data every 60 seconds

export default async function ShopPage({ params: paramsPromise }: { params: Promise<{ slug?: string }> }) {
    const params = await paramsPromise;
    const slug = params?.slug;

    const where: any = {
        isActive: true,
    };

    if (slug) {
        where.OR = [
            { category: { slug } },
            { category: { parent: { slug } } }
        ];
    }

    // Query initial storefront products and category metadata on the server
    const [dbProducts, total, category] = await Promise.all([
        prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take: 12,
        }),
        prisma.product.count({ where }),
        slug ? prisma.category.findUnique({
            where: { slug },
            include: {
                children: {
                    where: { isHidden: false },
                    orderBy: { displayOrder: 'asc' }
                },
                _count: { select: { products: true } }
            }
        }) : Promise.resolve(null)
    ]);

    // Map models to JSON-serializable types for Next.js Client Components (e.g. serialize Date and Decimal objects)
    const products = dbProducts.map((p) => ({
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

    const mappedCategory = category ? {
        ...category,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
        children: category.children.map((child: any) => ({
            ...child,
            createdAt: child.createdAt.toISOString(),
            updatedAt: child.updatedAt.toISOString(),
        }))
    } : null;

    return (
        <ShopClient
            initialProducts={products}
            initialTotal={total}
            initialCategory={mappedCategory}
            slug={slug}
        />
    );
}
