import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '7d'; // 7d, 30d, 90d

        const now = new Date();
        let startDate = new Date();
        if (range === '7d') startDate.setDate(now.getDate() - 7);
        else if (range === '30d') startDate.setDate(now.getDate() - 30);
        else if (range === '90d') startDate.setDate(now.getDate() - 90);

        // 1. Revenue over time
        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
                status: { notIn: ['CANCELLED', 'REFUNDED'] }
            },
            select: {
                createdAt: true,
                totalAmount: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by day
        const revenueData = orders.reduce((acc: any[], order) => {
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

        // 2. Top Brands Performance
        const topBrands = await prisma.brand.findMany({
            include: {
                _count: { select: { products: true } }
            },
            take: 5
        });

        // 3. Category Distribution
        const categoryData = await prisma.category.findMany({
            include: {
                _count: { select: { products: true } }
            }
        });

        // 4. Sales by Status
        const statusDistribution = await prisma.order.groupBy({
            by: ['status'],
            _count: true,
            _sum: { totalAmount: true }
        });

        return NextResponse.json({
            success: true,
            data: {
                revenueOverTime: revenueData,
                statusDistribution,
                topBrands: topBrands.map(b => ({ name: b.name, products: b._count.products })),
                categoryDistribution: categoryData.map(c => ({ name: c.name, value: c._count.products })),
            }
        });
    } catch (error) {
        console.error('Admin Analytics API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to extract intelligence manifest' }, { status: 500 });
    }
}
