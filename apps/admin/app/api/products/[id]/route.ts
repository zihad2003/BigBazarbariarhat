import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { auth } from '@/auth';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cacheKey = `products-detail-${id}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, data: cachedData });
        }

        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        let productImages: any[] = [];
        try {
            productImages = typeof product.images === 'string'
                ? JSON.parse(product.images)
                : (Array.isArray(product.images) ? product.images : []);
        } catch (e) {}

        const mappedProduct = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            basePrice: Number(product.price),
            salePrice: product.salePrice ? Number(product.salePrice) : null,
            stockQuantity: product.stock,
            images: productImages,
            categoryId: product.categoryId,
            category: product.category,
            isActive: product.isActive,
            featured: product.featured,
            isSale: product.isSale,
            isHot: product.isHot,
            isNew: product.isNew,
            variants: product.variants,
            description: product.description,
            instagramReelUrl: product.instagramReelUrl,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };

        setCache(cacheKey, mappedProduct, 10 * 1000); // Cache for 10 seconds

        return NextResponse.json({ success: true, data: mappedProduct });
    } catch (error) {
        console.error('Fetch Product ID Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
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

        // Verify product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        const updateData: any = {};
        if (name !== undefined) {
            updateData.name = name;
            // Optionally update slug if name changes
            const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            updateData.slug = `${baseSlug}-${id.slice(-5)}`;
        }
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null;
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (categoryId !== undefined) updateData.categoryId = categoryId;
        if (instagramReelUrl !== undefined) updateData.instagramReelUrl = instagramReelUrl;
        if (variants !== undefined) updateData.variants = variants;
        if (featured !== undefined) updateData.featured = !!featured;
        if (isSale !== undefined) updateData.isSale = !!isSale;
        if (isHot !== undefined) updateData.isHot = !!isHot;
        if (isNew !== undefined) updateData.isNew = !!isNew;
        if (images !== undefined) updateData.images = images;
        if (isActive !== undefined) updateData.isActive = !!isActive;
        if (body.sku !== undefined) updateData.sku = body.sku;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData
        });

        // Invalidate product-related caches
        invalidateCachePattern('products-');
        invalidateCachePattern('inventory-');
        invalidateCachePattern('dashboard-stats');

        return NextResponse.json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error('Update Product Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        
        // Check if product is referenced in orders (soft delete or check before delete)
        const orderCount = await prisma.orderItem.count({
            where: { productId: id }
        });

        if (orderCount > 0) {
            // Product has orders, so we soft delete it by setting isActive = false
            await prisma.product.update({
                where: { id },
                data: { isActive: false }
            });
            
            // Invalidate product-related caches
            invalidateCachePattern('products-');
            invalidateCachePattern('inventory-');
            invalidateCachePattern('dashboard-stats');
            
            return NextResponse.json({ 
                success: true, 
                message: 'Product is associated with existing orders. It has been deactivated instead of deleted.' 
            });
        }

        await prisma.product.delete({
            where: { id }
        });

        // Invalidate product-related caches
        invalidateCachePattern('products-');
        invalidateCachePattern('inventory-');
        invalidateCachePattern('dashboard-stats');

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
    }
}
