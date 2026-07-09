export const dynamic = 'force-dynamic';

import { prisma } from '@bigbazar/db';
import ProductsTableClient from './products-table-client';

interface ProductsPageProps {
    searchParams: Promise<{
        page?: string;
        q?: string;
        category?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams.page || '1');
    const q = resolvedParams.q || '';
    const categorySlug = resolvedParams.category || '';
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build Prisma query filter
    const whereClause: any = {};

    if (q) {
        whereClause.OR = [
            { name: { startsWith: q } },
            { sku: { startsWith: q } }
        ];
    }

    if (categorySlug) {
        whereClause.category = {
            slug: categorySlug
        };
    }

    // Fetch products, total count, and categories
    const [products, total, categories] = await Promise.all([
        prisma.product.findMany({
            where: whereClause,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.product.count({ where: whereClause }),
        prisma.category.findMany({
            orderBy: { displayOrder: 'asc' }
        })
    ]);

    // Map DB fields to keys expected by the frontend
    const mappedProducts = products.map((p: any) => {
        let productImages: any[] = [];
        try {
            productImages = typeof p.images === 'string'
                ? JSON.parse(p.images)
                : (Array.isArray(p.images) ? p.images : []);
        } catch (e) {}

        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            basePrice: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : null,
            stockQuantity: p.stock,
            images: productImages,
            category: p.category,
            isActive: p.isActive,
            featured: p.featured,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
        };
    });

    const totalPages = Math.ceil(total / limit);

    const pagination = {
        page,
        limit,
        total,
        totalPages
    };

    return (
        <ProductsTableClient
            initialProducts={mappedProducts}
            pagination={pagination}
            categories={categories}
        />
    );
}
