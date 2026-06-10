import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET() {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const cacheKey = 'categories-list';
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, data: cachedData });
        }

        const categories = await prisma.category.findMany({
            include: {
                parent: { select: { name: true } },
                _count: { select: { products: true } }
            },
            orderBy: { name: 'asc' }
        });

        setCache(cacheKey, categories, 30 * 1000); // Cache for 30 seconds

        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error('Categories GET Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const body = await req.json();
        const category = await prisma.category.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                image: body.image,
                parentId: body.parentId || null,
            }
        });

        // Invalidate categories and products related caches
        invalidateCachePattern('categories-');
        invalidateCachePattern('products-');

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error('Category POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to create category' }, { status: 500 });
    }
}

