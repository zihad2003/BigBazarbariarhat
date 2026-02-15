'use client';

import { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Users,
    Activity,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    PieChart as PieIcon,
    BarChart3,
    Layers,
    Binary
} from 'lucide-react';
import {
    AreaChart as OriginalAreaChart,
    Area as OriginalArea,
    XAxis as OriginalXAxis,
    YAxis as OriginalYAxis,
    CartesianGrid as OriginalCartesianGrid,
    Tooltip as OriginalTooltip,
    ResponsiveContainer as OriginalResponsiveContainer,
    PieChart as OriginalPieChart,
    Pie as OriginalPie,
    Cell as OriginalCell,
    BarChart as OriginalBarChart,
    Bar as OriginalBar
} from 'recharts';

const AreaChart = OriginalAreaChart as any;
const Area = OriginalArea as any;
const XAxis = OriginalXAxis as any;
const YAxis = OriginalYAxis as any;
const CartesianGrid = OriginalCartesianGrid as any;
const Tooltip = OriginalTooltip as any;
const ResponsiveContainer = OriginalResponsiveContainer as any;
const PieChart = OriginalPieChart as any;
const Pie = OriginalPie as any;
const Cell = OriginalCell as any;
const BarChart = OriginalBarChart as any;
const Bar = OriginalBar as any;

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

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
                console.error('Failed to fetch intelligence:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [range]);

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="h-20 w-20 animate-spin text-indigo-600" />
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">Interrogating Central Intelligence Hub...</p>
            </div>
        );
    }

    const totalRevenue = data?.revenueOverTime.reduce((sum: number, item: any) => sum + item.revenue, 0) || 0;
    const totalOrders = data?.revenueOverTime.reduce((sum: number, item: any) => sum + item.orders, 0) || 0;

    return (
        <div className="space-y-12 pb-20">
            {/* Intel Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter italic">Intelligence</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-4 flex items-center gap-3">
                        <Activity className="h-4 w-4 text-indigo-500" /> Real-time operational matrix and trajectory analysis
                    </p>
                </div>
                <div className="bg-white border-2 border-gray-50 p-2 rounded-3xl flex gap-2">
                    {['7d', '30d', '90d'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${range === r ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black'}`}
                        >
                            {r} Manifest
                        </button>
                    ))}
                </div>
            </div>

            {/* Performance Node Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Cumulative Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', color: 'from-indigo-600 to-indigo-400' },
                    { label: 'Validated Orders', value: totalOrders, icon: ShoppingBag, trend: '+8.2%', color: 'from-emerald-500 to-emerald-300' },
                    { label: 'Mean Entity Value', value: `৳${Math.round(totalRevenue / (totalOrders || 1)).toLocaleString()}`, icon: TrendingUp, trend: '+5.4%', color: 'from-amber-400 to-amber-200' },
                    { label: 'Network Velocity', value: 'High', icon: Activity, trend: 'Optimal', color: 'from-gray-900 to-gray-700' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-bl-[8rem] group-hover:scale-110 transition-transform`} />
                        <stat.icon className="h-10 w-10 text-gray-900 mb-8" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-4xl font-black text-gray-900 tracking-tighter italic">{stat.value}</h4>
                            <span className="text-[10px] font-black text-emerald-500 flex items-center gap-1 mb-1">
                                <ArrowUpRight className="h-4 w-4" /> {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Primary Trajectory Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 bg-white rounded-[4rem] border border-gray-100 p-12 shadow-2xl shadow-indigo-900/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Binary className="h-40 w-40 text-black" />
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight italic">Revenue Trajectory</h3>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Temporal distribution of capital inflow</p>
                        </div>
                        <div className="flex items-center gap-4 mt-6 md:mt-0">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Revenue</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.revenueOverTime}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Classification Distribution */}
                <div className="bg-black rounded-[4rem] p-12 text-white shadow-2xl shadow-black/40 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                    <h3 className="text-2xl font-black mb-10 border-b border-white/10 pb-8 tracking-tight italic flex items-center gap-4">
                        <PieIcon className="h-6 w-6 text-indigo-400" />
                        Entity Distribution
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.categoryDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data?.categoryDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#000', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-10 space-y-4">
                        {data?.categoryDistribution.map((cat: any, i: number) => (
                            <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group/item hover:border-white/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                                </div>
                                <span className="font-mono text-xs font-black italic">{cat.value} Units</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tactical Intel Matrices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-[4rem] border border-gray-100 p-12 shadow-sm group">
                    <h3 className="text-2xl font-black text-gray-900 mb-12 tracking-tight italic flex items-center gap-4">
                        <BarChart3 className="h-6 w-6 text-indigo-500" />
                        Top Tier Brand Traction
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.topBrands}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', fontWeight: 900 }}
                                />
                                <Bar dataKey="products" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-indigo-50 rounded-[4rem] p-12 border border-indigo-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 text-indigo-200/50 group-hover:scale-110 transition-transform">
                        <Layers className="h-40 w-40" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-indigo-950 mb-12 tracking-tight italic flex items-center gap-4">
                            Operational Health Manifest
                        </h3>
                        <div className="space-y-6">
                            {data?.statusDistribution.map((status: any, i: number) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-indigo-100 flex justify-between items-center group/item hover:scale-[1.02] transition-all">
                                    <div className="flex flex-col">
                                        <Badge className="w-fit mb-2 bg-indigo-600 text-white border-none uppercase tracking-widest text-[8px] font-black">
                                            {status.status}
                                        </Badge>
                                        <span className="text-3xl font-black text-indigo-950 tracking-tighter italic">৳{Number(status._sum.totalAmount || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Node Count</p>
                                        <p className="text-xl font-black text-indigo-600 italic">{status._count} Manifests</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
