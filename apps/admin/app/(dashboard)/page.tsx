'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    DollarSign, ShoppingCart, Package, Users,
    TrendingUp, TrendingDown, AlertTriangle, ArrowUpRight,
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar,
} from 'recharts';

/* ──────────────────── Styles ──────────────────── */

const statusStyle: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    Processing: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    Shipped: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400',
    Delivered: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
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
                    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                        }`}>
                        {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                        {trend === 'down' && <TrendingDown className="w-3 h-3" />}
                        {change}
                    </span>
                    <span className="text-[11px] text-muted-foreground">vs last month</span>
                </div>
            </div>
        </div>
    );
}

/* ──────────────────── Page ──────────────────── */

export default function DashboardPage() {
    const router = useRouter();
    
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const res = await fetch('/api/dashboard/stats');
            const json = await res.json();
            if (!json.success) throw new Error('Failed to fetch dashboard stats');
            return json.data;
        }
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[13px] font-medium text-muted-foreground animate-pulse">Loading real-time stats...</p>
                </div>
            </div>
        );
    }

    const stats = data?.stats || { sales: 0, orders: 0, products: 0, customers: 0 };
    const chartData = data?.chartData || [];
    const recentOrders = data?.recentOrders || [];
    const lowStock = data?.lowStock || [];

    return (
        <div className="space-y-6 max-w-[1400px]">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Real-time store overview.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3.5 py-2 text-[13px] font-medium border border-border rounded-lg hover:bg-muted/60 transition-colors">Download</button>
                    <button className="px-3.5 py-2 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                        New Order
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Stat label="Sales" value={`৳${stats.sales.toLocaleString()}`} change="+12.4%" trend="up" icon={DollarSign} accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" />
                <Stat label="Orders" value={stats.orders.toString()} change="+5.2%" trend="up" icon={ShoppingCart} accent="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" />
                <Stat label="Products" value={stats.products.toString()} change="0%" trend="flat" icon={Package} accent="bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400" />
                <Stat label="Customers" value={stats.customers.toString()} change="+8.9%" trend="up" icon={Users} accent="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Revenue Chart */}
                <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold text-foreground">Sales Performance</h2>
                        <span className="text-[11px] text-muted-foreground">Last 7 days</span>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(234 89% 60%)" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="hsl(234 89% 60%)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} dy={8} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} width={45} />
                                <Tooltip
                                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(220 13% 91%)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                    cursor={{ stroke: 'hsl(234 89% 60%)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="hsl(234 89% 60%)" strokeWidth={2} fill="url(#grad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold text-foreground">Order Volume</h2>
                        <span className="text-[11px] text-muted-foreground">Last 7 days</span>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220 9% 46%)' }} dy={8} />
                                <Tooltip
                                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(220 13% 91%)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                    cursor={{ fill: 'hsl(220 14% 96%)' }}
                                />
                                <Bar dataKey="orders" fill="hsl(234 89% 60%)" radius={[4, 4, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

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
                                {recentOrders.length > 0 ? recentOrders.map((o: any) => (
                                    <tr key={o.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => router.push(`/orders/${o.id}`)}>
                                        <td className="py-3 text-[13px] font-medium text-foreground">#{o.id}</td>
                                        <td className="py-3 text-[13px] text-foreground">{o.customer}</td>
                                        <td className="py-3 text-[13px] font-medium text-foreground">৳{o.amount.toLocaleString()}</td>
                                        <td className="py-3">
                                            <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${statusStyle[o.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-[13px] text-muted-foreground">{o.date}</td>
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
                        {lowStock.length > 0 ? lowStock.map((item: any) => (
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
                    <p className="text-sm opacity-60 mb-6">Database connected to <span className="text-primary font-semibold opacity-100 italic">Aiven Cloud MySQL</span></p>
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
