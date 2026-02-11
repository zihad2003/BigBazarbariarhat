import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const customer = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                addresses: true,
                reviews: {
                    include: { product: { select: { name: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        if (!customer) {
            return NextResponse.json({ success: false, error: 'Entity not found' }, { status: 404 });
        }

        const stats = {
            totalSpent: customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
            orderCount: customer.orders.length,
            averageOrderValue: customer.orders.length > 0
                ? customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0) / customer.orders.length
                : 0,
            lastOrder: customer.orders[0] || null
        };

        return NextResponse.json({
            success: true,
            data: { ...customer, stats }
        });
    } catch (error) {
        console.error('Admin Customer Detail API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch entity details' }, { status: 500 });
    }
}
