'use client';

import { useState, useEffect } from 'react';
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Activity,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics?range=${range}`);
                const result = await res.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [range]);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[13px] font-medium text-muted-foreground animate-pulse">Loading analytics...</p>
                </div>
            </div>
        );
    }

    const overview = data?.overview || { totalRevenue: 0, totalOrders: 0 };
    const chartData = data?.chartData || [];
    const avgOrderValue = overview.totalOrders > 0 ? Math.round(overview.totalRevenue / overview.totalOrders) : 0;

    return (
        <div className="space-y-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Detailed store performance metrics.</p>
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-lg border border-border">
                    {['7d', '30d', '90d'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-all ${range === r ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Total Revenue</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-foreground tracking-tight">৳{overview.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Total Orders</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <ShoppingCart className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-foreground tracking-tight">{overview.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Avg. Order Value</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-foreground tracking-tight">৳{avgOrderValue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Conversion Rate</span>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-foreground tracking-tight">--%</p>
                        <p className="text-[11px] text-muted-foreground mt-1.5">Tracking unavailable</p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Revenue Chart */}
                <div className="bg-card border border-border rounded-xl p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-foreground">Revenue Trend</h2>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(234 89% 60%)" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="hsl(234 89% 60%)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} dy={8} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} width={45} />
                                <Tooltip
                                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(220 13% 91%)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="hsl(234 89% 60%)" strokeWidth={2} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-card border border-border rounded-xl p-5">
                    <div className="mb-5">
                        <h2 className="text-sm font-semibold text-foreground">Orders Trend</h2>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} dy={8} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} width={30} />
                                <Tooltip
                                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(220 13% 91%)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                    cursor={{ fill: 'hsl(220 14% 96%)' }}
                                />
                                <Bar dataKey="orders" fill="hsl(234 89% 60%)" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
