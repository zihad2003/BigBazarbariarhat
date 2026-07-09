export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { startOfDay, subDays, format } from 'date-fns';
import { getCache, setCache } from '@/lib/cache';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET() {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const cacheKey = 'dashboard-stats';
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({
                success: true,
                data: cachedData
            });
        }

        // 1. Core KPIs
        const [totalSales, totalOrders, totalProducts, totalCustomers] = await Promise.all([
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: 'DELIVERED' }
            }),
            prisma.order.count(),
            prisma.product.count(),
            prisma.user.count({ where: { role: 'USER' } })
        ]);

        // 2. Recent Orders (Top 5)
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        });

        // 3. Low Stock Items (Stock < 10)
        const lowStock = await prisma.product.findMany({
            where: { stock: { lt: 10 }, isActive: true },
            take: 4,
            orderBy: { stock: 'asc' }
        });

        // 4. Chart Data (Last 7 Days Revenue)
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
        
        const startDate = startOfDay(last7Days[0]);
        const endDate = new Date(startOfDay(last7Days[6]).getTime() + 24 * 60 * 60 * 1000);

        const ordersInLast7Days = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate, lt: endDate },
                status: 'DELIVERED'
            },
            select: {
                createdAt: true,
                totalAmount: true
            }
        });

        const chartData = last7Days.map((date) => {
            const start = startOfDay(date);
            const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            
            const daysOrders = ordersInLast7Days.filter((o) => {
                const orderDate = new Date(o.createdAt);
                return orderDate >= start && orderDate < end;
            });

            const revenue = daysOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
            const orders = daysOrders.length;

            return {
                day: format(date, 'eee'),
                revenue,
                orders
            };
        });

        const responseData = {
            stats: {
                sales: totalSales._sum.totalAmount || 0,
                orders: totalOrders,
                products: totalProducts,
                customers: totalCustomers
            },
            recentOrders: recentOrders.map(o => ({
                id: o.id.slice(-4),
                customer: o.user?.name || 'Guest',
                amount: o.totalAmount,
                status: o.status,
                date: format(new Date(o.createdAt), 'MMM d')
            })),
            lowStock: lowStock.map(p => ({
                name: p.name,
                sku: p.sku || 'N/A',
                qty: p.stock
            })),
            chartData
        };

        setCache(cacheKey, responseData, 30 * 1000); // Cache for 30 seconds

        return NextResponse.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
