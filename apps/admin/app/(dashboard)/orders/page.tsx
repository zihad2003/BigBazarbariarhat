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
import { useQuery } from '@tanstack/react-query';

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data, isLoading } = useQuery({
        queryKey: ['orders', debouncedSearchQuery, page],
        queryFn: async () => {
            const res = await fetch(`/api/orders?page=${page}&limit=10&q=${debouncedSearchQuery}`);
            const result = await res.json();
            if (!result.success) throw new Error('Failed to fetch orders');
            return result;
        }
    });

    const orders = data?.data || [];
    const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };
    const loading = isLoading;

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
            <div className="flex items-center justify-between pb-6 border-b border-border">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Orders</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Manage and track your customer orders.</p>
                </div>
                <button className="px-4 py-2 border border-border rounded-lg text-[13px] font-medium hover:bg-muted/60 transition flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by order number or name..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                    />
                </div>
                <button className="px-4 h-10 border border-border rounded-lg flex items-center gap-2 text-[13px] font-medium hover:bg-muted/60 transition">
                    <Filter className="w-4 h-4" />
                    More Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/20 border-b border-border">
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Order</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-6 h-20 bg-muted/5"></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-[13px] text-muted-foreground">No orders found.</p>
                                    </td>
                                </tr>
                            ) : orders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-muted/10 transition-colors group">
                                    <td className="px-6 py-4 text-[14px] font-bold text-foreground">#{order.orderNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-[14px] font-semibold text-foreground">{order.user?.firstName || order.guestName || 'Guest'}</div>
                                        <div className="text-[12px] text-muted-foreground">{order.user?.email || order.guestEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-[14px] font-bold text-foreground">৳{order.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/orders/${order.id}`}>
                                                <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between">
                    <p className="text-[12px] text-muted-foreground">
                        Showing <span className="font-bold text-foreground">{orders.length}</span> of <span className="font-bold text-foreground">{pagination.total}</span> orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="p-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(p + 1, pagination.totalPages))}
                            disabled={page === pagination.totalPages}
                            className="p-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
