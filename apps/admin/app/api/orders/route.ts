export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { getCache, setCache } from '@/lib/cache';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const q = searchParams.get('q') || '';
        const skip = (page - 1) * limit;

        const cacheKey = `orders-list-${page}-${limit}-${q}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, ...cachedData });
        }

        const whereClause: any = {};
        if (q) {
            whereClause.OR = [
                { orderNumber: { contains: q } },
                { user: { name: { contains: q } } },
                { user: { email: { contains: q } } }
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: whereClause,
                include: { 
                    user: { select: { name: true, email: true } },
                    items: { include: { product: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.order.count({ where: whereClause })
        ]);

        const mappedOrders = orders.map((order: any) => {
            let shipping: any = {};
            try {
                shipping = typeof order.shippingAddress === 'string' 
                    ? JSON.parse(order.shippingAddress) 
                    : order.shippingAddress;
            } catch (e) {}

            return {
                ...order,
                guestName: shipping?.fullName || shipping?.shipping?.fullName || null,
                guestEmail: shipping?.email || shipping?.shipping?.email || null,
            };
        });

        const totalPages = Math.ceil(total / limit);

        const responseData = {
            data: mappedOrders,
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
        console.error('Fetch Orders Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
    }
}
