import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { checkAdminAuth } from '@/lib/auth-utils';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';

export async function GET(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const status = searchParams.get('status') || 'ALL';

        const cacheKey = `inventory-list-${q}-${status}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, data: cachedData });
        }

        let where: any = {};
        if (q) {
            where.OR = [
                { name: { contains: q } },
                { sku: { contains: q } }
            ];
        }
        
        if (status === 'LOW_STOCK') {
            where.stock = { gt: 0, lte: 10 };
        } else if (status === 'OUT_OF_STOCK') {
            where.stock = { lte: 0 };
        }

        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });

        const mappedData = products.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            images: p.images,
            stockQuantity: p.stock,
            product: {
                name: p.name,
                category: p.category
            }
        }));

        setCache(cacheKey, mappedData, 10 * 1000); // Cache for 10 seconds

        return NextResponse.json({ success: true, data: mappedData });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch inventory' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const body = await req.json();
        const { id, stockQuantity } = body;
        
        const updated = await prisma.product.update({
            where: { id },
            data: { stock: parseInt(stockQuantity, 10) }
        });
        
        // Invalidate caches
        invalidateCachePattern('inventory-');
        invalidateCachePattern('products-');
        invalidateCachePattern('dashboard-stats');

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to update stock' }, { status: 500 });
    }
}
