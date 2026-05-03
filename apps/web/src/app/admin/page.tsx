'use client';

import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    ShoppingBag, 
    Package, 
    Users, 
    ArrowUpRight, 
    MoreHorizontal,
    AlertTriangle,
    CheckCircle2,
    Clock,
    XCircle,
    Eye
} from 'lucide-react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';

// --- Mock Data ---
const revenueData = [
    { day: '01', amount: 4500 }, { day: '05', amount: 3200 }, { day: '10', amount: 5800 },
    { day: '15', amount: 4900 }, { day: '20', amount: 7200 }, { day: '25', amount: 6400 },
    { day: '30', amount: 8100 },
];

const categoryData = [
    { name: 'Electronics', value: 45 },
    { name: 'Clothing', value: 30 },
    { name: 'Food', value: 20 },
    { name: 'Home', value: 15 },
    { name: 'Beauty', value: 10 },
];

const paymentData = [
    { name: 'COD', value: 400 },
    { name: 'bKash', value: 300 },
    { name: 'Card', value: 100 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

const recentOrders = [
    { id: 'ORD-1234', customer: 'Abdur Rahman', items: 3, total: 4500, status: 'delivered', date: '2026-05-01' },
    { id: 'ORD-1235', customer: 'Zihad Islam', items: 1, total: 1200, status: 'processing', date: '2026-05-01' },
    { id: 'ORD-1236', customer: 'Farah Ahmed', items: 2, total: 3400, status: 'pending', date: '2026-05-02' },
    { id: 'ORD-1237', customer: 'Tanvir Hasan', items: 5, total: 8900, status: 'shipped', date: '2026-05-02' },
];

const lowStockProducts = [
    { id: '1', name: 'Premium Artifact Bowl', stock: 4, price: 1200 },
    { id: '2', name: 'Minimalist Desk Lamp', stock: 2, price: 3400 },
    { id: '3', name: 'Cotton Linen Tote', stock: 8, price: 850 },
];

const topSelling = [
    { name: 'Handcrafted Vase', sold: 124, revenue: 148800 },
    { name: 'Eco-Friendly Yoga Mat', sold: 98, revenue: 68600 },
    { name: 'Scented Soy Candle', sold: 85, revenue: 21250 },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-12">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: '৳542,850', sub: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Total Orders', value: '1,248', sub: '+8.2%', trend: 'up', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Products', value: '342', sub: '24 new this month', trend: 'neutral', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Total Customers', value: '8,420', sub: '-2.4%', trend: 'down', icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((stat, idx) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                <stat.icon className="h-7 w-7" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                                stat.trend === 'up' ? "text-emerald-500" : stat.trend === 'down' ? "text-rose-500" : "text-slate-400"
                            )}>
                                {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : stat.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                                {stat.sub}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h3>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter font-mono">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Revenue Chart */}
                <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Revenue Trajectory</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest px-4 rounded-lg bg-slate-50 border-slate-100">Last 30 Days</Button>
                            <Button variant="ghost" className="h-8 text-[9px] font-black uppercase tracking-widest px-4 rounded-lg text-slate-400">Previous</Button>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111827', borderRadius: '16px', border: 'none', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 900 }}
                                    labelStyle={{ color: '#6366f1', fontSize: '10px', fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase' }}
                                />
                                <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Bar Chart */}
                <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-10">Sector Distribution</h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#1e293b' }} width={80} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Recent Orders & Alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* Recent Orders */}
                <div className="xl:col-span-8 bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Transactions</h3>
                        <Button variant="outline" className="h-10 text-[9px] font-black uppercase tracking-widest px-6 rounded-xl border-slate-100">View Manifest Archive</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-y-4">
                            <thead>
                                <tr className="text-left">
                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 pl-4">Identifier</th>
                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4">Customer</th>
                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 text-center">Volume</th>
                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4">Value</th>
                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 text-center">Status</th>
                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 text-right pr-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="space-y-4">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="py-5 pl-4 rounded-l-2xl">
                                            <span className="text-sm font-black text-slate-900 font-mono">#{order.id}</span>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{order.date}</p>
                                        </td>
                                        <td className="py-5 font-black text-slate-900 text-sm uppercase tracking-tight">{order.customer}</td>
                                        <td className="py-5 text-center font-bold text-slate-400 text-xs">{order.items} Units</td>
                                        <td className="py-5 font-black text-slate-900 text-sm font-mono">{formatPrice(order.total)}</td>
                                        <td className="py-5">
                                            <div className="flex justify-center">
                                                <div className={cn(
                                                    "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2",
                                                    order.status === 'delivered' ? "bg-emerald-100 text-emerald-600" :
                                                    order.status === 'processing' ? "bg-blue-100 text-blue-600" :
                                                    order.status === 'pending' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
                                                )}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    {order.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 pr-4 text-right rounded-r-2xl">
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white hover:shadow-lg transition-all">
                                                <Eye className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Panels */}
                <div className="xl:col-span-4 space-y-8">
                    
                    {/* Low Stock Alerts */}
                    <div className="bg-rose-50 rounded-[2.5rem] p-10 border border-rose-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
                        <div className="flex items-center gap-4 mb-8">
                            <AlertTriangle className="h-6 w-6 text-rose-500" />
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Depletion Matrix</h3>
                        </div>
                        <div className="space-y-6 mb-10">
                            {lowStockProducts.map((p) => (
                                <div key={p.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{p.name}</p>
                                        <p className="text-[9px] font-bold text-rose-500 uppercase mt-1">Remaining: {p.stock} Units</p>
                                    </div>
                                    <Button variant="outline" className="h-8 px-3 rounded-lg text-[8px] font-black uppercase tracking-widest bg-white border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">RESTOCK</Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Alpha Artifacts</h3>
                        <div className="space-y-8">
                            {topSelling.map((p, i) => (
                                <div key={p.name} className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xs">
                                        0{i+1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{p.name}</h4>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{p.sold} ACQUISITIONS</p>
                                            <p className="text-xs font-black text-emerald-600 font-mono">{formatPrice(p.revenue)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-10 h-14 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                            Full Analytics <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
