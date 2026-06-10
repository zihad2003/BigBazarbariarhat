import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { getCache, setCache } from '@/lib/cache';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET(req: Request) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const query = searchParams.get('q') || '';
        const skip = (page - 1) * limit;

        const cacheKey = `customers-list-${page}-${limit}-${query}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, ...cachedData });
        }

        // Fetch users with order stats
        const users = await prisma.user.findMany({
            where: {
                role: 'USER',
                OR: [
                    { name: { startsWith: query } },
                    { email: { startsWith: query } },
                    { phone: { startsWith: query } },
                ],
            },
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    select: { totalAmount: true }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        // Calculate total spent for each user
        const formattedUsers = users.map(user => {
            const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            return {
                id: user.id,
                name: user.name || 'Anonymous',
                email: user.email,
                phone: user.phone || '',
                orderCount: user._count.orders,
                totalSpent: totalSpent,
                createdAt: user.createdAt,
            };
        });

        const total = await prisma.user.count({
            where: {
                role: 'USER',
                OR: [
                    { name: { startsWith: query } },
                    { email: { startsWith: query } },
                    { phone: { startsWith: query } },
                ],
            },
        });

        const responseData = {
            data: formattedUsers,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            }
        };

        setCache(cacheKey, responseData, 10 * 1000); // Cache for 10 seconds

        return NextResponse.json({
            success: true,
            ...responseData
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 });
    }
}
