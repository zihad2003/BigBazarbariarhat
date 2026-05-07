import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { startOfDay, subDays, format } from 'date-fns';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || '7d';
        
        const days = parseInt(range.replace('d', ''), 10) || 7;
        const lastDays = Array.from({ length: days }, (_, i) => subDays(new Date(), i)).reverse();
        
        const chartData = await Promise.all(lastDays.map(async (date) => {
            const start = startOfDay(date);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            
            const stats = await prisma.order.aggregate({
                _sum: { totalAmount: true },
                _count: { id: true },
                where: {
                    createdAt: { gte: start, lt: end },
                    status: 'DELIVERED'
                }
            });

            return {
                day: format(date, 'MMM dd'),
                revenue: Number(stats._sum.totalAmount || 0),
                orders: stats._count.id || 0
            };
        }));

        return NextResponse.json({
            success: true,
            data: {
                chartData,
                overview: {
                    totalRevenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
                    totalOrders: chartData.reduce((acc, curr) => acc + curr.orders, 0)
                }
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch analytics' }, { status: 500 });
    }
}
