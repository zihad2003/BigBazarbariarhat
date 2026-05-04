'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Download,
    Eye,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Package
} from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders?page=${page}&limit=10&q=${searchQuery}`);
            const result = await res.json();
            if (result.success) {
                setOrders(result.data || []);
                if (result.pagination) {
                    setPagination({
                        page: result.pagination.page,
                        totalPages: result.pagination.totalPages,
                        totalItems: result.pagination.total
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(1);
    }, [searchQuery]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'PROCESSING': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Orders</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Manage and track your customer orders.</p>
                </div>
                <button className="px-4 py-2 border border-border rounded-lg text-[13px] font-medium hover:bg-muted/60 transition flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Orders
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                    />
                </div>
                <button className="px-4 h-10 border border-border rounded-lg flex items-center gap-2 text-[13px] font-medium hover:bg-muted/60 transition">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/20">
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Order ID</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-4 py-8"><div className="h-4 bg-muted rounded w-1/4" /></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-20 text-center">
                                        <Package className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                                        <p className="text-[13px] text-muted-foreground">No orders found.</p>
                                    </td>
                                </tr>
                            ) : orders.map(order => (
                                <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-4 py-4 text-[13px] font-semibold text-foreground">#{order.orderNumber}</td>
                                    <td className="px-4 py-4">
                                        <div className="text-[13px] font-medium">{order.user?.firstName || order.guestName || 'Guest'}</div>
                                        <div className="text-[11px] text-muted-foreground">{order.user?.email || order.guestEmail}</div>
                                    </td>
                                    <td className="px-4 py-4 text-[13px] text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-[13px] font-bold">৳{order.totalAmount.toLocaleString()}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Link href={`/orders/${order.id}`} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors inline-block">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/10">
                    <p className="text-[11px] text-muted-foreground">
                        Showing {orders.length} orders
                    </p>
                    <div className="flex items-center gap-1">
                        <button disabled className="p-1.5 border border-border rounded-md opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                        <button disabled className="p-1.5 border border-border rounded-md opacity-50"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
