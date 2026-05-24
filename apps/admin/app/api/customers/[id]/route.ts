import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cacheKey = `customers-detail-${id}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, data: cachedData });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                reviews: {
                    include: { product: true },
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: { orders: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
        }

        // Calculate Stats
        const allOrders = await prisma.order.findMany({
            where: { userId: id },
            select: { totalAmount: true }
        });

        const totalSpent = allOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const orderCount = allOrders.length;
        const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;

        const responseData = {
            ...user,
            stats: {
                totalSpent,
                orderCount,
                averageOrderValue
            },
            // For UI compatibility, providing empty addresses as placeholder if not in schema
            addresses: [] 
        };

        setCache(cacheKey, responseData, 10 * 1000); // Cache for 10 seconds

        return NextResponse.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch customer' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
            }
        });

        // Invalidate customer-related caches
        invalidateCachePattern('customers-');
        invalidateCachePattern('dashboard-stats');

        return NextResponse.json({ success: true, data: updatedUser });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update customer' }, { status: 500 });
    }
}
