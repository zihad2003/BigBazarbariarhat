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
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: { not: 'CANCELLED' } }
            }),
            prisma.user.count(),
            prisma.product.count({ where: { isActive: true } }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: { firstName: true, email: true }
                    }
                }
            }),
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
