import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    try {
        const { userId, sessionClaims } = await auth();
        const role = (sessionClaims?.metadata as Record<string, string>)?.role;

        if (!userId || role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const period = request.nextUrl.searchParams.get('period') || '30d';

        // Calculate date range
        const periodDays = period === '7d' ? 7 : period === '90d' ? 90 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);
        const startISO = startDate.toISOString();

        const previousStart = new Date();
        previousStart.setDate(previousStart.getDate() - periodDays * 2);
        const previousISO = previousStart.toISOString();

        // ── Revenue ──────────────────────────────────
        const { data: currentOrders } = await supabaseAdmin
            .from('orders')
            .select('total_amount, created_at')
            .gte('created_at', startISO)
            .neq('status', 'cancelled') as any;

        const { data: previousOrders } = await supabaseAdmin
            .from('orders')
            .select('total_amount')
            .gte('created_at', previousISO)
            .lt('created_at', startISO)
            .neq('status', 'cancelled') as any;

        const currentRevenue = (currentOrders || []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const previousRevenue = (previousOrders || []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
        const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

        // Daily revenue breakdown
        const dailyMap = new Map<string, number>();
        for (let i = 0; i < periodDays; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (periodDays - 1 - i));
            dailyMap.set(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 0);
        }
        (currentOrders || []).forEach((o: any) => {
            const key = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dailyMap.has(key)) {
                dailyMap.set(key, (dailyMap.get(key) || 0) + (o.total_amount || 0));
            }
        });
        const daily = Array.from(dailyMap.entries()).map(([date, amount]) => ({ date, amount }));

        // ── Orders ───────────────────────────────────
        const { count: currentOrderCount } = await supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startISO) as any;

        const { count: previousOrderCount } = await supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', previousISO)
            .lt('created_at', startISO) as any;

        const orderChange = (previousOrderCount || 0) > 0
            ? (((currentOrderCount || 0) - (previousOrderCount || 0)) / (previousOrderCount || 1)) * 100
            : 0;

        // Order status breakdown
        const statusColors: Record<string, string> = {
            pending: '#F59E0B',
            processing: '#3B82F6',
            shipped: '#8B5CF6',
            delivered: '#10B981',
            cancelled: '#EF4444',
        };
        const byStatus: { status: string; count: number; color: string }[] = [];
        for (const st of ['pending', 'processing', 'shipped', 'delivered', 'cancelled']) {
            const { count } = await supabaseAdmin
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startISO)
                .eq('status', st) as any;
            byStatus.push({ status: st, count: count || 0, color: statusColors[st] || '#888' });
        }

        // ── Customers ────────────────────────────────
        const { count: totalCustomers } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true }) as any;

        const { count: previousCustomers } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true })
            .lt('created_at', startISO) as any;

        const customerChange = (previousCustomers || 0) > 0
            ? (((totalCustomers || 0) - (previousCustomers || 0)) / (previousCustomers || 1)) * 100
            : 0;

        const { count: newCustomers } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startISO) as any;

        // ── Products ─────────────────────────────────
        const { count: activeProducts } = await supabaseAdmin
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true) as any;

        // Top selling — from order_items
        const { data: topSelling } = await supabaseAdmin
            .from('order_items')
            .select('product_id, products(name), quantity, price')
            .gte('created_at', startISO)
            .limit(5) as any;

        const topSellingProducts = (topSelling || []).map((item: any) => ({
            id: item.product_id,
            name: item.products?.name || 'Unknown',
            sold: item.quantity || 0,
            revenue: (item.quantity || 0) * (item.price || 0),
        }));

        // Low stock
        const { data: lowStockData } = await supabaseAdmin
            .from('products')
            .select('id, name, stock_quantity')
            .eq('is_active', true)
            .lte('stock_quantity', 10)
            .order('stock_quantity', { ascending: true })
            .limit(5) as any;

        const lowStock = (lowStockData || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            stock: p.stock_quantity || 0,
        }));

        // ── Top Categories ───────────────────────────
        const { data: catData } = await supabaseAdmin
            .from('categories')
            .select('id, name') as any;

        const topCategories = (catData || []).slice(0, 5).map((c: any) => ({
            name: c.name,
            count: 0,
            revenue: 0,
        }));

        // ── Response ─────────────────────────────────
        const analyticsData = {
            revenue: { total: currentRevenue, previous: previousRevenue, change: revenueChange, daily },
            orders: { total: currentOrderCount || 0, previous: previousOrderCount || 0, change: orderChange, byStatus },
            customers: { total: totalCustomers || 0, previous: previousCustomers || 0, change: customerChange, newThisMonth: newCustomers || 0 },
            products: { totalActive: activeProducts || 0, topSelling: topSellingProducts, lowStock },
            topCategories,
        };

        return NextResponse.json({ success: true, data: analyticsData });
    } catch (error: any) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}
