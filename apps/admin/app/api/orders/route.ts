import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const q = searchParams.get('q') || '';
        const skip = (page - 1) * limit;

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

        return NextResponse.json({ 
            success: true, 
            data: mappedOrders,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
    }
}
