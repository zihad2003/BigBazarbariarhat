import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                shortDescription: body.shortDescription,
                categoryId: body.categoryId,
                brandId: body.brandId || null,
                sku: body.sku,
                barcode: body.barcode || null,
                basePrice: body.basePrice,
                salePrice: body.salePrice || null,
                costPrice: body.costPrice || null,
                stockQuantity: parseInt(body.stockQuantity) || 0,
                lowStockThreshold: parseInt(body.lowStockThreshold) || 10,
                isActive: body.isActive ?? true,
                isFeatured: body.isFeatured ?? false,
                isNewArrival: body.isNewArrival ?? true,
                metaTitle: body.metaTitle || null,
                metaDescription: body.metaDescription || null,
                metaKeywords: body.metaKeywords || null,
            }
        });

        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        console.error('Admin Product Create API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create product'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { sku: { contains: q, mode: 'insensitive' } },
                    ]
                },
                include: {
                    category: { select: { name: true } },
                    images: { where: { isPrimary: true }, take: 1 }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.product.count({
                where: {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { sku: { contains: q, mode: 'insensitive' } },
                    ]
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Admin Products List API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}
