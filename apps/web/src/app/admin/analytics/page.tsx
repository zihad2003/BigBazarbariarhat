'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    ArrowUpRight,
    Loader2,
    CalendarDays,
    BarChart3,
    PieChart as PieChartIcon,
    RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Types ────────────────────────────────────────────────────
interface AnalyticsData {
    revenue: {
        total: number;
        previous: number;
        change: number;
        daily: { date: string; amount: number }[];
    };
    orders: {
        total: number;
        previous: number;
        change: number;
        byStatus: { status: string; count: number; color: string }[];
    };
    customers: {
        total: number;
        previous: number;
        change: number;
        newThisMonth: number;
    };
    products: {
        totalActive: number;
        topSelling: { id: string; name: string; sold: number; revenue: number }[];
        lowStock: { id: string; name: string; stock: number }[];
    };
    topCategories: { name: string; count: number; revenue: number }[];
}

// ─── Mini Bar Chart Component ─────────────────────────────────
function MiniBarChart({ data, maxHeight = 80 }: { data: { date: string; amount: number }[]; maxHeight?: number }) {
    const max = Math.max(...data.map(d => d.amount), 1);
    return (
        <div className="flex items-end gap-1 h-20">
            {data.map((d, i) => (
                <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm transition-all hover:from-indigo-700 hover:to-indigo-500 cursor-pointer group relative"
                    style={{ height: `${(d.amount / max) * maxHeight}px`, minHeight: '4px' }}
                    title={`${d.date}: ৳${d.amount.toLocaleString()}`}
                >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ৳{d.amount.toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Donut Segment Component ──────────────────────────────────
function StatusDonut({ data }: { data: { status: string; count: number; color: string }[] }) {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    let accumulatedPercent = 0;

    return (
        <div className="flex items-center gap-8">
            <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {data.map((d, i) => {
                        const percent = total > 0 ? (d.count / total) * 100 : 0;
                        const offset = accumulatedPercent;
                        accumulatedPercent += percent;
                        return (
                            <circle
                                key={i}
                                cx="18"
                                cy="18"
                                r="15.9"
                                fill="none"
                                stroke={d.color}
                                strokeWidth="3"
                                strokeDasharray={`${percent} ${100 - percent}`}
                                strokeDashoffset={`${-offset}`}
                                className="transition-all duration-700"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">{total}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total</span>
                </div>
            </div>
            <div className="space-y-3">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-sm font-bold text-gray-600 capitalize">{d.status}</span>
                        <span className="text-sm font-black text-gray-900 ml-auto">{d.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ title, value, change, icon: Icon, prefix = '' }: {
    title: string; value: number; change: number; icon: React.ElementType; prefix?: string;
}) {
    const isPositive = change >= 0;
    return (
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon className="h-7 w-7" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black ${isPositive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(change).toFixed(1)}%
                </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{title}</p>
            <p className="text-4xl font-black tracking-tight">{prefix}{value.toLocaleString()}</p>
        </div>
    );
}

// ─── Main Analytics Page ──────────────────────────────────────
export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/analytics?period=${period}`);
            const result = await res.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            // Provide mock data for development
            setData({
                revenue: {
                    total: 245600,
                    previous: 198400,
                    change: 23.8,
                    daily: Array.from({ length: 30 }, (_, i) => ({
                        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        amount: Math.floor(Math.random() * 15000) + 2000,
                    })),
                },
                orders: {
                    total: 342,
                    previous: 289,
                    change: 18.3,
                    byStatus: [
                        { status: 'pending', count: 42, color: '#F59E0B' },
                        { status: 'processing', count: 65, color: '#3B82F6' },
                        { status: 'shipped', count: 89, color: '#8B5CF6' },
                        { status: 'delivered', count: 134, color: '#10B981' },
                        { status: 'cancelled', count: 12, color: '#EF4444' },
                    ]
                },
                customers: { total: 1247, previous: 1089, change: 14.5, newThisMonth: 158 },
                products: {
                    totalActive: 486,
                    topSelling: [
                        { id: '1', name: 'Premium Cotton Kurta', sold: 89, revenue: 71200 },
                        { id: '2', name: 'Classic Polo Collection', sold: 76, revenue: 60800 },
                        { id: '3', name: 'Silk Saree Elegance', sold: 54, revenue: 97200 },
                        { id: '4', name: 'Denim Jogger Pants', sold: 48, revenue: 33600 },
                        { id: '5', name: 'Leather Crossbody Bag', sold: 42, revenue: 46200 },
                    ],
                    lowStock: [
                        { id: '1', name: 'Summer Floral Dress', stock: 3 },
                        { id: '2', name: 'Classic White Sneaker', stock: 5 },
                        { id: '3', name: 'Bamboo Watch Set', stock: 2 },
                    ],
                },
                topCategories: [
                    { name: "Men's Fashion", count: 142, revenue: 85200 },
                    { name: "Women's Fashion", count: 198, revenue: 118800 },
                    { name: 'Electronics', count: 67, revenue: 53600 },
                    { name: 'Home & Living', count: 45, revenue: 27000 },
                ],
            });
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Analytics</h1>
                    <p className="text-gray-500 font-medium mt-1">Performance overview for your store</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        {(['7d', '30d', '90d'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${period === p ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="icon" onClick={fetchAnalytics} className="rounded-xl h-10 w-10">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={data.revenue.total} change={data.revenue.change} icon={DollarSign} prefix="৳" />
                <StatCard title="Total Orders" value={data.orders.total} change={data.orders.change} icon={ShoppingCart} />
                <StatCard title="Total Customers" value={data.customers.total} change={data.customers.change} icon={Users} />
                <StatCard title="Active Products" value={data.products.totalActive} change={0} icon={Package} />
            </div>

            {/* Revenue Chart + Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-5 w-5 text-gray-400" />
                            <h3 className="font-black text-lg">Revenue Trend</h3>
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last {period === '7d' ? '7' : period === '30d' ? '30' : '90'} days</span>
                    </div>
                    <MiniBarChart data={data.revenue.daily} maxHeight={120} />
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 font-medium">
                        <CalendarDays className="h-3 w-3" />
                        {data.revenue.daily[0]?.date} — {data.revenue.daily[data.revenue.daily.length - 1]?.date}
                    </div>
                </div>

                {/* Order Status Donut */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <PieChartIcon className="h-5 w-5 text-gray-400" />
                        <h3 className="font-black text-lg">Orders by Status</h3>
                    </div>
                    <StatusDonut data={data.orders.byStatus} />
                </div>
            </div>

            {/* Top Products + Top Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-lg">Top Selling Products</h3>
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-5">
                        {data.products.topSelling.map((product, i) => (
                            <div key={product.id} className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-xs font-black text-gray-400 border border-gray-100">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{product.name}</p>
                                    <p className="text-xs text-gray-400">{product.sold} sold</p>
                                </div>
                                <span className="font-black text-sm">৳{product.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-lg">Top Categories</h3>
                        <ArrowUpRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="space-y-5">
                        {data.topCategories.map((cat, i) => {
                            const maxRevenue = Math.max(...data.topCategories.map(c => c.revenue));
                            return (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-sm">{cat.name}</span>
                                        <span className="font-black text-sm">৳{cat.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                                            style={{ width: `${(cat.revenue / maxRevenue) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{cat.count} orders</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Low Stock Alert */}
            {data.products.lowStock.length > 0 && (
                <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
                    <h3 className="font-black text-lg text-amber-800 mb-4">⚠️ Low Stock Alert</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {data.products.lowStock.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl p-5 border border-amber-200">
                                <p className="font-bold text-sm mb-1">{product.name}</p>
                                <p className="text-2xl font-black text-amber-600">{product.stock} left</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
