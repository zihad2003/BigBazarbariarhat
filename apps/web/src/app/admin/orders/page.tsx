'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    Search, 
    Filter, 
    Download, 
    MoreHorizontal, 
    Eye, 
    Printer, 
    Mail, 
    Truck, 
    CheckCircle2, 
    Clock, 
    XCircle,
    RefreshCcw,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    CreditCard,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';
import { MOCK_ORDERS } from '@/lib/mock-data/orders';

const STATUS_CONFIG: Record<string, { color: string, bg: string, label: string }> = {
    pending: { color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
    processing: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Processing' },
    shipped: { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Shipped' },
    delivered: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Delivered' },
    cancelled: { color: 'text-rose-600', bg: 'bg-rose-50', label: 'Cancelled' },
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState('all');
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const localOrders = JSON.parse(localStorage.getItem('bigbazar-orders') || '[]');
        setOrders([...MOCK_ORDERS, ...localOrders]);
        setIsLoaded(true);
    }, []);

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             o.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
        const matchesPayment = selectedPayment === 'all' || o.paymentMethod.toLowerCase().includes(selectedPayment.toLowerCase());
        return matchesSearch && matchesStatus && matchesPayment;
    });

    const updateStatus = (id: string, newStatus: string) => {
        const updated = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
        setOrders(updated);
        localStorage.setItem('bigbazar-orders', JSON.stringify(updated.filter(o => o.id.startsWith('BB-')))); // Only save newly created to local
    };

    const toggleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id));
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-indigo-600" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Transaction Command</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Manifest Archive</h1>
                </div>
                <Button variant="outline" className="rounded-2xl h-14 px-8 border-slate-200 text-[11px] font-black uppercase tracking-widest gap-3 hover:bg-slate-50 transition-all">
                    <Download className="h-4 w-4" /> Export Transactions
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-6">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search Manifest ID or Curator..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="relative min-w-[160px]">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer">
                            <option>All Dates</option>
                            <option>Today</option>
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <select 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer min-w-[140px]"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select 
                        value={selectedPayment}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer min-w-[140px]"
                    >
                        <option value="all">All Channels</option>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                        <option value="cash">COD</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            <AnimatePresence>
                {selectedOrders.length > 0 && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between text-white shadow-xl shadow-black/10">
                            <div className="flex items-center gap-4 pl-4">
                                <span className="text-[11px] font-black uppercase tracking-widest">{selectedOrders.length} Manifests Selected</span>
                                <div className="h-4 w-px bg-white/20" />
                                <button className="text-[10px] font-black uppercase tracking-widest hover:text-indigo-400">Update Status</button>
                                <button className="text-[10px] font-black uppercase tracking-widest hover:text-indigo-400">Print Invoices</button>
                            </div>
                            <Button variant="ghost" className="text-white hover:bg-white/10 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                                Terminate Selected
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Orders Table */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="py-6 px-8 w-10">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                    />
                                </th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manifest ID</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Curator</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Volume</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Value</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Channel</th>
                                <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                <th className="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.map((order) => {
                                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                return (
                                    <tr key={order.id} className={cn("group transition-colors hover:bg-slate-50/50", selectedOrders.includes(order.id) && "bg-indigo-50/30")}>
                                        <td className="py-6 px-8">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => {
                                                    if (selectedOrders.includes(order.id)) {
                                                        setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                                                    } else {
                                                        setSelectedOrders([...selectedOrders, order.id]);
                                                    }
                                                }}
                                                className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-900 font-mono tracking-tight uppercase">#{order.id}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">{new Date(order.date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{order.shippingAddress.fullName}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">{order.shippingAddress.phone}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 text-center font-bold text-slate-400 text-xs">{order.items.length} Units</td>
                                        <td className="py-6 px-4 font-black text-slate-900 text-sm font-mono">{formatPrice(order.total)}</td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[8px] font-black text-slate-400">
                                                    {order.paymentMethod.includes('bKash') ? 'bK' : order.paymentMethod.includes('Nagad') ? 'Na' : '৳'}
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{order.paymentMethod}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="relative group/status flex justify-center">
                                                <button className={cn(
                                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                                                    status.bg, status.color
                                                )}>
                                                    {status.label}
                                                    <ChevronDown className="h-3 w-3" />
                                                </button>
                                                <div className="absolute top-full mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-20 py-2 overflow-hidden">
                                                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                                        <button 
                                                            key={key}
                                                            onClick={() => updateStatus(order.id, key)}
                                                            className={cn(
                                                                "w-full px-6 py-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors",
                                                                order.status === key ? cfg.color : "text-slate-400"
                                                            )}
                                                        >
                                                            {cfg.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <button className="p-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all text-slate-400">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                                                    <Printer className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized {filteredOrders.length} Manifests</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-100 text-slate-400 disabled:opacity-30" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button className="h-10 w-10 p-0 rounded-xl bg-indigo-600 text-white text-[10px] font-black">1</Button>
                        <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-100 text-slate-400" disabled>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
