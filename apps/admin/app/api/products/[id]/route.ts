import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: {
                category: true,
                brand: true,
                images: { orderBy: { displayOrder: 'asc' } },
                variants: true,
                attributes: { include: { key: true } }
            }
        });

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        console.error('Admin Product Detail API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        // Update product with transaction for images/variants if needed
        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                shortDescription: body.shortDescription,
                categoryId: body.categoryId,
                brandId: body.brandId,
                sku: body.sku,
                barcode: body.barcode,
                basePrice: body.basePrice,
                salePrice: body.salePrice,
                costPrice: body.costPrice,
                stockQuantity: parseInt(body.stockQuantity),
                lowStockThreshold: parseInt(body.lowStockThreshold),
                isActive: body.isActive,
                isFeatured: body.isFeatured,
                isNewArrival: body.isNewArrival,
                metaTitle: body.metaTitle,
                metaDescription: body.metaDescription,
                metaKeywords: body.metaKeywords,
            }
        });

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        console.error('Admin Product Update API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.product.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error('Admin Product Delete API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }
}
