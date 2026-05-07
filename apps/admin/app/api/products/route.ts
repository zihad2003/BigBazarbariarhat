import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const q = searchParams.get('q') || '';
        const categorySlug = searchParams.get('category') || '';
        const skip = (page - 1) * limit;

        // Build conditional where clause for text search and category filter
        const whereClause: any = {
            isActive: true
        };

        if (q) {
            whereClause.OR = [
                { name: { contains: q } },
                { sku: { contains: q } }
            ];
        }

        if (categorySlug) {
            whereClause.category = {
                slug: categorySlug
            };
        }

        // Fetch paginated products and total count concurrently
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: whereClause,
                include: { category: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.product.count({ where: whereClause })
        ]);

        // Map database fields to the exact keys expected by the frontend
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
                basePrice: Number(p.price), // Map price -> basePrice for frontend compatibility
                salePrice: p.salePrice ? Number(p.salePrice) : null,
                stockQuantity: p.stock,     // Map stock -> stockQuantity for inventory view
                images: productImages,
                category: p.category,
                isActive: p.isActive,
                featured: p.featured,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt
            };
        });

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({ 
            success: true, 
            data: mappedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Fetch Products Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
    }
}
