import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const query = searchParams.get('q') || '';
        const skip = (page - 1) * limit;

        // Fetch users with order stats
        const users = await prisma.user.findMany({
            where: {
                role: 'USER',
                OR: [
                    { name: { contains: query } },
                    { email: { contains: query } },
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
                orderCount: user._count.orders,
                totalSpent: totalSpent,
                createdAt: user.createdAt,
            };
        });

        const total = await prisma.user.count({
            where: {
                role: 'USER',
                OR: [
                    { name: { contains: query } },
                    { email: { contains: query } },
                ],
            },
        });

        return NextResponse.json({
            success: true,
            data: formattedUsers,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 });
    }
}
