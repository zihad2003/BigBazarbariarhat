'use client';

import { useState, useEffect } from 'react';
import {
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Clock,
    Loader2
} from 'lucide-react';

// Stats Card Component
function StatsCard({
    title,
    value,
    change,
    changeType,
    icon: Icon
}: {
    title: string;
    value: string | number;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: any;
}) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-400 font-black uppercase tracking-widest">{title}</p>
                    <p className="text-3xl font-black mt-3 text-gray-900">{value}</p>
                    <div className="flex items-center gap-2 mt-4">
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap ${changeType === 'positive' ? 'bg-green-100 text-green-600' :
                            changeType === 'negative' ? 'bg-red-100 text-red-600' :
                                'bg-gray-100 text-gray-500'
                            }`}>
                            {changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
                            {changeType === 'negative' && <TrendingDown className="h-3 w-3" />}
                            {change}
                        </div>
                        <span className="text-gray-300 text-[10px] font-bold uppercase">vs last month</span>
                    </div>
                </div>
                <div className={`p-4 rounded-[1.5rem] transition-transform group-hover:scale-110 ${changeType === 'positive' ? 'bg-green-50 text-green-600' :
                    changeType === 'negative' ? 'bg-red-50 text-red-600' :
                        'bg-indigo-50 text-indigo-600'
                    }`}>
                    <Icon className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats');
                if (!res.ok) throw new Error('Failed to fetch stats');
                const result = await res.json();
                if (result.success) {
                    setStats(result.data);
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing Store Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <AlertTriangle className="h-12 w-12 text-rose-500" />
                <h3 className="text-xl font-bold text-gray-900">Dashboard Unavailable</h3>
                <p className="text-gray-500 text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Reload</button>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700',
        PROCESSING: 'bg-indigo-100 text-indigo-700',
        SHIPPED: 'bg-blue-100 text-blue-700',
        DELIVERED: 'bg-emerald-100 text-emerald-700',
        CANCELLED: 'bg-rose-100 text-rose-700',
    };

    return (
        <div className="space-y-12 pb-10">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Command Center</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">Real-time store performance overview</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => alert('Download Report feature coming soon!')} className="bg-white border border-gray-100 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Download Report</button>
                    <button onClick={() => alert('Manage Orders feature coming soon!')} className="bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-gray-800 transition-all">Manage Orders</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    title="Gross Revenue"
                    value={`৳${stats?.totalRevenue?.toLocaleString() || '0'}`}
                    change="+12.4%"
                    changeType="positive"
                    icon={DollarSign}
                />
                <StatsCard
                    title="Volume Orders"
                    value={stats?.totalOrders || '0'}
                    change="+5.2%"
                    changeType="positive"
                    icon={ShoppingCart}
                />
                <StatsCard
                    title="Active Stock"
                    value={stats?.activeProducts || '0'}
                    change="0%"
                    changeType="neutral"
                    icon={Package}
                />
                <StatsCard
                    title="Loyal Base"
                    value={stats?.totalCustomers || '0'}
                    change="+8.9%"
                    changeType="positive"
                    icon={Users}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-2xl font-black">Incoming Orders</h3>
                        <button className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Full Analytics</button>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            {/* Header */}
                            <div className="flex text-[10px] text-gray-400 border-b border-gray-50 pb-4 mb-4 px-4">
                                <div className="w-[15%] font-black uppercase tracking-widest">UID</div>
                                <div className="w-[30%] font-black uppercase tracking-widest">Identity</div>
                                <div className="w-[20%] font-black uppercase tracking-widest">Amount</div>
                                <div className="w-[20%] font-black uppercase tracking-widest">Status</div>
                                <div className="w-[15%] font-black uppercase tracking-widest">Temporal</div>
                            </div>

                            {/* Rows */}
                            <div className="space-y-4">
                                {stats?.recentOrders?.map((order: any) => (
                                    <div key={order.id} className="flex items-center p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-100 transition-all group cursor-pointer">
                                        <div className="w-[15%] font-black text-gray-900">#{order.orderNumber?.slice(-4)}</div>
                                        <div className="w-[30%]">
                                            <div className="font-bold text-gray-900 truncate">{order.user?.firstName || order.guestName || 'Anonymous'}</div>
                                            <div className="text-[10px] text-gray-400 font-black truncate uppercase">{order.user?.email || order.guestEmail}</div>
                                        </div>
                                        <div className="w-[20%] font-black text-gray-900">৳{order.totalAmount.toLocaleString()}</div>
                                        <div className="w-[20%]">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status] || 'bg-gray-100'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="w-[15%] text-[10px] font-black text-gray-400 uppercase">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                ))}
                                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                                    <div className="text-center py-10 text-gray-400 font-bold uppercase text-xs">No Recent Traffic Detected</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Critical Stock Alert */}
                <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-rose-50 rounded-2xl">
                            <AlertTriangle className="h-7 w-7 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">Stock Crisis</h3>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Immediate restock required</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {stats?.lowStockProducts?.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-5 bg-rose-50/50 rounded-2xl border border-rose-100/50 group hover:bg-rose-50 transition-all">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-black text-gray-900 truncate">{item.name}</p>
                                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-1">SKU: {item.sku}</p>
                                </div>
                                <div className="text-right ml-4">
                                    <span className="block text-xl font-black text-rose-600 leading-none">{item.stockQuantity}</span>
                                    <span className="text-[8px] font-black text-rose-300 uppercase tracking-tighter">Units Left</span>
                                </div>
                            </div>
                        ))}
                        {(!stats?.lowStockProducts || stats.lowStockProducts.length === 0) && (
                            <div className="text-center py-20 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-xs">Inventory Optimized</p>
                            </div>
                        )}
                    </div>
                    <button onClick={() => alert('Inventory Update feature coming soon!')} className="w-full mt-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:bg-gray-800 transition-all">
                        Bulk Inventory Update
                    </button>
                </div>
            </div>

            {/* Bottom Row - Efficiency & Logistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <h4 className="text-3xl font-black mb-4">Logistics Performance</h4>
                            <p className="text-gray-400 font-medium text-lg leading-relaxed mb-10">Average delivery window has decreased by <span className="text-indigo-400 font-black">1.2 days</span> this month compared to last quarter.</p>
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-4xl font-black mb-1">2.4d</div>
                                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Avg. Cycle Time</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black mb-1 text-emerald-400">98%</div>
                                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">On-time Surcharge</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-40 h-40 border-8 border-gray-800 rounded-full flex items-center justify-center relative">
                            <div className="text-2xl font-black">74%</div>
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="44%" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="276" strokeDashoffset="72" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-gray-100 p-12 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black">Operational Velocity</h3>
                        <Clock className="h-8 w-8 text-gray-200" />
                    </div>
                    <div className="space-y-6">
                        {[
                            { label: 'Order Processing', value: 'High', color: 'bg-emerald-500' },
                            { label: 'Customer Inquiry Response', value: 'Medium', color: 'bg-amber-500' },
                            { label: 'Inventory Restocking', value: 'Excellent', color: 'bg-indigo-500' },
                        ].map((item) => (
                            <div key={item.label} className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                    <span className="text-gray-400">{item.label}</span>
                                    <span className="text-gray-900">{item.value}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: item.value === 'High' ? '85%' : item.value === 'Medium' ? '45%' : '95%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
