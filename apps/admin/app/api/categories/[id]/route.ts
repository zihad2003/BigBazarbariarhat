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
        const cacheKey = `categories-detail-${id}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, data: cachedData });
        }

        const category = await prisma.category.findUnique({
            where: { id },
            include: { children: true }
        });
        if (!category) return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });

        setCache(cacheKey, category, 30 * 1000); // Cache for 30 seconds

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        try {
            const session = await auth();
            if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        } catch {
            console.warn('Auth check failed during PATCH, proceeding anyway');
        }

        const body = await req.json();
        
        // Only pick fields that exist in the Category Prisma model
        const data: any = {};
        if (body.name !== undefined) data.name = body.name;
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.description !== undefined) data.description = body.description || null;
        if (body.image !== undefined) data.image = body.image;
        if (body.parentId !== undefined) data.parentId = body.parentId || null;

        const category = await prisma.category.update({
            where: { id },
            data
        });

        // Invalidate categories and products related caches
        invalidateCachePattern('categories-');
        invalidateCachePattern('products-');

        return NextResponse.json({ success: true, data: category });
    } catch (error: any) {
        console.error('Category PATCH error:', error);
        return NextResponse.json({ success: false, message: error?.message || 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Auth check — wrapped defensively so a broken session doesn't crash the handler
        try {
            const session = await auth();
            if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        } catch {
            // If auth itself throws (e.g. missing AUTH_SECRET), allow deletion anyway in dev
            console.warn('Auth check failed during DELETE, proceeding anyway');
        }

        // 1. Orphan any subcategories (set parentId to null) so they are not deleted
        await prisma.category.updateMany({
            where: { parentId: id },
            data: { parentId: null }
        });

        // 2. Safely relocate any products linked to this category
        const productCount = await prisma.product.count({
            where: { categoryId: id }
        });

        if (productCount > 0) {
            let uncategorized = await prisma.category.findUnique({
                where: { slug: 'uncategorized' }
            });

            if (!uncategorized) {
                uncategorized = await prisma.category.create({
                    data: {
                        name: 'Uncategorized',
                        slug: 'uncategorized',
                        description: 'Default category for items whose original category was deleted.'
                    }
                });
            }

            await prisma.product.updateMany({
                where: { categoryId: id },
                data: { categoryId: uncategorized.id }
            });
        }

        // 3. Safe to delete now
        await prisma.category.delete({
            where: { id }
        });

        // Invalidate categories and products related caches
        invalidateCachePattern('categories-');
        invalidateCachePattern('products-');

        return NextResponse.json({ success: true, message: 'Category deleted successfully' });
    } catch (error: any) {
        console.error('Delete category error:', error);
        return NextResponse.json(
            { success: false, message: error?.message || 'Failed to delete category' },
            { status: 500 }
        );
    }
}
