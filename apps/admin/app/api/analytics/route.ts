import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { startOfDay, subDays, format } from 'date-fns';
import { getCache, setCache } from '@/lib/cache';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || '7d';
        
        const cacheKey = `analytics-${range}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({
                success: true,
                data: cachedData
            });
        }

        const days = parseInt(range.replace('d', ''), 10) || 7;
        const lastDays = Array.from({ length: days }, (_, i) => subDays(new Date(), i)).reverse();
        
        const startDate = startOfDay(lastDays[0]);
        const endDate = new Date(startOfDay(lastDays[days - 1]).getTime() + 24 * 60 * 60 * 1000);

        const ordersInRange = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate, lt: endDate },
                status: 'DELIVERED'
            },
            select: {
                createdAt: true,
                totalAmount: true
            }
        });

        const chartData = lastDays.map((date) => {
            const start = startOfDay(date);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            
            const daysOrders = ordersInRange.filter((o) => {
                const orderDate = new Date(o.createdAt);
                return orderDate >= start && orderDate < end;
            });

            const revenue = daysOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
            const orders = daysOrders.length;

            return {
                day: format(date, 'MMM dd'),
                revenue,
                orders
            };
        });

        const responseData = {
            chartData,
            overview: {
                totalRevenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
                totalOrders: chartData.reduce((acc, curr) => acc + curr.orders, 0)
            }
        };

        setCache(cacheKey, responseData, 60 * 1000); // Cache for 60 seconds

        return NextResponse.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch analytics' }, { status: 500 });
    }
}
