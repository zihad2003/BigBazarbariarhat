import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { auth } from '@/auth';
import { checkAdminAuth } from '@/lib/auth-utils';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const q = searchParams.get('q') || '';
        const categorySlug = searchParams.get('category') || '';
        const skip = (page - 1) * limit;

        const cacheKey = `products-list-${page}-${limit}-${q}-${categorySlug}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, ...cachedData });
        }

        // Build conditional where clause for text search and category filter
        const whereClause: any = {
            isActive: true
        };

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

        const responseData = {
            data: mappedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };

        setCache(cacheKey, responseData, 10 * 1000); // Cache for 10 seconds

        return NextResponse.json({ 
            success: true, 
            ...responseData
        });
    } catch (error) {
        console.error('Fetch Products Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const body = await req.json();
        const {
            name,
            description,
            price,
            salePrice,
            stock,
            categoryId,
            instagramReelUrl,
            variants,
            featured,
            isSale,
            isHot,
            isNew,
            images,
            isActive
        } = body;

        // Validation
        if (!name || price === undefined || !categoryId) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        // Generate SKU if not provided or generate a default one
        const sku = body.sku || `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Generate slug from name
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const slug = `${baseSlug}-${Math.random().toString(36).substr(2, 5)}`;

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                salePrice: salePrice ? parseFloat(salePrice) : null,
                sku,
                stock: parseInt(stock || '0'),
                images: images || [],
                instagramReelUrl,
                categoryId,
                isActive: isActive !== undefined ? isActive : true,
                featured: !!featured,
                isSale: !!isSale,
                isHot: !!isHot,
                isNew: !!isNew,
                variants: variants || []
            }
        });

        // Invalidate product-related caches
        invalidateCachePattern('products-');
        invalidateCachePattern('inventory-');
        invalidateCachePattern('dashboard-stats');

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        console.error('Product POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to create product' }, { status: 500 });
    }
}
