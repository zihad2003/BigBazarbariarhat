import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const [
            totalOrders,
            totalRevenue,
            totalCustomers,
            activeProducts,
            recentOrders,
            lowStockProducts
        ] = await Promise.all([
            // @ts-ignore
            prisma.order.count(),
            // @ts-ignore
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: { not: 'CANCELLED' } }
            }),
            // @ts-ignore
            prisma.user.count(),
            // @ts-ignore
            prisma.product.count({ where: { isActive: true } }),
            // @ts-ignore
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { firstName: true, email: true }
                    }
                }
            }),
            // @ts-ignore
            prisma.product.findMany({
                where: { stockQuantity: { lte: 10 } },
                take: 5,
                orderBy: { stockQuantity: 'asc' }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalOrders,
                totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
                totalCustomers,
                activeProducts,
                recentOrders,
                lowStockProducts,
            }
        });
    } catch (error) {
        console.error('Admin Stats API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch operation telemetry' }, { status: 500 });
    }
}
