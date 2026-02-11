import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Core filters
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const query = searchParams.get('q') || searchParams.get('search');

    // Performance filters
    const featured = searchParams.get('featured') === 'true';
    const newArrivals = searchParams.get('new') === 'true' || searchParams.get('newArrivals') === 'true';

    // Value filters
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

    // Attribute filters (comma separated)
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean);
    const colors = searchParams.get('colors')?.split(',').filter(Boolean);

    // Pagination & Sort
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    try {
        const where: any = {
            isActive: true,
        };

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.category = { slug: category };
        }

        if (brand) {
            where.brand = { slug: brand };
        }

        if (featured) {
            where.isFeatured = true;
        }

        if (newArrivals) {
            where.isNewArrival = true;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.salePrice = {};
            if (minPrice !== undefined) where.salePrice.gte = minPrice;
            if (maxPrice !== undefined) where.salePrice.lte = maxPrice;
        }

        // Filtering by variants (size/color)
        if (sizes || colors) {
            where.variants = {
                some: {
                    isActive: true,
                }
            };
            if (sizes && sizes.length > 0) {
                where.variants.some.size = { in: sizes };
            }
            if (colors && colors.length > 0) {
                where.variants.some.color = { in: colors };
            }
        }

        let orderBy: any = {};
        switch (sortBy) {
            case 'price_asc':
                orderBy = { salePrice: 'asc' };
                break;
            case 'price_desc':
                orderBy = { salePrice: 'desc' };
                break;
            case 'popular':
                orderBy = { viewCount: 'desc' };
                break;
            case 'rating':
                orderBy = { averageRating: 'desc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    brand: true,
                    images: {
                        orderBy: { displayOrder: 'asc' },
                        take: 1,
                    },
                    variants: {
                        where: { isActive: true },
                    }
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            }
        });
    } catch (error) {
        console.error('Products API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                description: body.description,
                shortDescription: body.shortDescription,
                categoryId: body.categoryId,
                brandId: body.brandId,
                sku: body.sku,
                barcode: body.barcode,
                basePrice: body.basePrice,
                salePrice: body.salePrice,
                costPrice: body.costPrice,
                stockQuantity: body.stockQuantity,
                lowStockThreshold: body.lowStockThreshold,
                isActive: body.isActive !== undefined ? body.isActive : true,
                isFeatured: body.isFeatured || false,
                isNewArrival: body.isNewArrival || false,
                metaTitle: body.metaTitle,
                metaDescription: body.metaDescription,
                metaKeywords: body.metaKeywords,
            }
        });

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Create Product Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
