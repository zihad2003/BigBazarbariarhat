import { prisma } from '../client';

export const AnalyticsService = {
    async getOperationMatrix(range: string = '7d') {
        const now = new Date();
        let startDate = new Date();
        if (range === '7d') startDate.setDate(now.getDate() - 7);
        else if (range === '30d') startDate.setDate(now.getDate() - 30);
        else if (range === '90d') startDate.setDate(now.getDate() - 90);

        const [orders, topBrands, categoryData, statusDistribution] = await Promise.all([
            prisma.order.findMany({
                where: {
                    createdAt: { gte: startDate },
                    status: { notIn: ['CANCELLED', 'REFUNDED'] }
                },
                select: { createdAt: true, totalAmount: true },
                orderBy: { createdAt: 'asc' }
            }),
            prisma.brand.findMany({
                include: { _count: { select: { products: true } } },
                take: 5
            }),
            prisma.category.findMany({
                include: { _count: { select: { products: true } } }
            }),
            prisma.order.groupBy({
                by: ['status'],
                _count: true,
                _sum: { totalAmount: true }
            })
        ]);

        const revenueData = orders.reduce((acc: any[], order: any) => {
            const date = order.createdAt.toISOString().split('T')[0];
            const existing = acc.find(item => item.date === date);
            if (existing) {
                existing.revenue += Number(order.totalAmount);
                existing.orders += 1;
            } else {
                acc.push({ date, revenue: Number(order.totalAmount), orders: 1 });
            }
            return acc;
        }, []);

        return {
            revenueOverTime: revenueData,
            statusDistribution,
            topBrands: topBrands.map((b: any) => ({ name: b.name, products: b._count.products })),
            categoryDistribution: categoryData.map((c: any) => ({ name: c.name, value: c._count.products })),
        };
    },

    async getDashboardStats() {
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

        return {
            totalOrders,
            totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
            totalCustomers,
            activeProducts,
            recentOrders,
            lowStockProducts,
        };
    }
};
