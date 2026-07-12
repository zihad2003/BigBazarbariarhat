export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@bigbazar/db';
import { startOfDay, subDays, format } from 'date-fns';
import {
    DollarSign, ShoppingCart, Package, Users,
    ArrowUpRight, AlertTriangle, Plus
} from 'lucide-react';
import DashboardChartsWrapper from '@/components/dashboard/dashboard-charts-wrapper';

/* ──────────────────── Styles ──────────────────── */

const statusStyle: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-100',
    PROCESSING: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100',
    SHIPPED: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400 border border-violet-100',
    DELIVERED: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100',
    CANCELLED: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100',
};

/* ──────────────────── Stat Card ──────────────────── */

function Stat({ label, value, change, trend, icon: Icon, accent }: {
    label: string; value: string; change: string;
    trend: 'up' | 'down' | 'flat'; icon: any; accent: string;
}) {
    return (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div>
                <p className="text-2xl font-semibold text-foreground tracking-tight">{value}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {change}
                    </span>
                    <span className="text-[11px] text-muted-foreground">vs last month</span>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────── Page ──────────────────── */

export default async function DashboardPage() {
    // Fetch dashboard stats directly from DB
    const [totalSales, totalOrders, totalProducts, totalCustomers] = await Promise.all([
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: 'DELIVERED' }
        }),
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count({ where: { role: 'USER' } })
    ]);

    // Fetch recent orders
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
    });

    // Fetch low stock items
    const lowStock = await prisma.product.findMany({
        where: { stock: { lt: 10 }, isActive: true },
        take: 4,
        orderBy: { stock: 'asc' }
    });

    // Fetch chart data (last 7 days revenue)
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

    const formattedRecentOrders = recentOrders.map(o => ({
        id: o.id.slice(-4),
        fullId: o.id,
        customer: o.user?.name || (o.shippingAddress && typeof o.shippingAddress === 'object' && (o.shippingAddress as any).name) || 'Guest',
        amount: Number(o.totalAmount),
        status: o.status,
        date: format(new Date(o.createdAt), 'MMM d')
    }));

    const formattedLowStock = lowStock.map(p => ({
        name: p.name,
        sku: p.sku || 'N/A',
        qty: p.stock
    }));

    const salesValue = totalSales._sum.totalAmount ? Number(totalSales._sum.totalAmount) : 0;

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Real-time store overview.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/orders" className="px-3.5 py-2 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                        View Orders
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link href="/products/new" className="px-3.5 py-2 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Stat label="Sales" value={`৳${salesValue.toLocaleString()}`} change="+12.4%" trend="up" icon={DollarSign} accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" />
                <Stat label="Orders" value={totalOrders.toString()} change="+5.2%" trend="up" icon={ShoppingCart} accent="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" />
                <Stat label="Products" value={totalProducts.toString()} change="0%" trend="flat" icon={Package} accent="bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400" />
                <Stat label="Customers" value={totalCustomers.toString()} change="+8.9%" trend="up" icon={Users} accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
            </div>

            {/* Charts Row */}
            <DashboardChartsWrapper chartData={chartData} />

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Recent Orders */}
                <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-foreground">New Orders</h2>
                        <Link href="/orders" className="text-[12px] font-medium text-primary hover:underline">View all</Link>
                    </div>
                    <div className="overflow-x-auto -mx-5 px-5">
                        <table className="w-full min-w-[480px]">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3">ID</th>
                                    <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3">Customer</th>
                                    <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3">Price</th>
                                    <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3">Status</th>
                                    <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider pb-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {formattedRecentOrders.length > 0 ? formattedRecentOrders.map((o: any) => (
                                    <tr key={o.fullId} className="hover:bg-muted/30 transition-colors group">
                                        <td className="py-3 text-[13px] font-medium text-foreground">
                                            <Link href={`/orders/${o.fullId}`} className="block">
                                                #{o.id}
                                            </Link>
                                        </td>
                                        <td className="py-3 text-[13px] text-foreground">
                                            <Link href={`/orders/${o.fullId}`} className="block">
                                                {o.customer}
                                            </Link>
                                        </td>
                                        <td className="py-3 text-[13px] font-medium text-foreground">
                                            <Link href={`/orders/${o.fullId}`} className="block">
                                                ৳{o.amount.toLocaleString()}
                                            </Link>
                                        </td>
                                        <td className="py-3">
                                            <Link href={`/orders/${o.fullId}`} className="block">
                                                <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${statusStyle[o.status] || 'bg-slate-100 text-slate-600'}`}>
                                                    {o.status}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="py-3 text-[13px] text-muted-foreground">
                                            <Link href={`/orders/${o.fullId}`} className="block">
                                                {o.date}
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-[13px] text-muted-foreground">No recent orders.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <h2 className="text-sm font-semibold text-foreground">Low Stock Alert</h2>
                    </div>
                    <div className="space-y-3">
                        {formattedLowStock.length > 0 ? formattedLowStock.map((item: any) => (
                            <div key={item.sku} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-medium text-foreground truncate">{item.name}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                                </div>
                                <div className="text-right ml-3 shrink-0">
                                    <span className={`text-lg font-semibold ${item.qty <= 2 ? 'text-red-500' : 'text-amber-500'}`}>{item.qty}</span>
                                    <p className="text-[10px] text-muted-foreground">left</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-8 text-center text-[13px] text-muted-foreground">
                                <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                Inventory is healthy.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Logistics Preview */}
            <div className="bg-foreground text-background rounded-xl p-6 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/15 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <h3 className="text-base font-semibold mb-1">Operational Health</h3>
                    <p className="text-sm opacity-60 mb-6">Database connected to <span className="text-primary font-semibold opacity-100 italic">TiDB Cloud Serverless</span></p>
                    <div className="flex gap-8">
                        <div>
                            <p className="text-3xl font-semibold">Active</p>
                            <p className="text-[11px] opacity-50 mt-1">Store Status</p>
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-emerald-400">Stable</p>
                            <p className="text-[11px] opacity-50 mt-1">Data Latency</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
