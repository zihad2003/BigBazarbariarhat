'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Package
} from 'lucide-react';

interface OrdersTableClientProps {
    initialOrders: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function OrdersTableClient({
    initialOrders,
    pagination
}: OrdersTableClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

    // Sync state with URL params when they change
    useEffect(() => {
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

    // Handle search input debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentQ = searchParams.get('q') || '';
            if (searchQuery !== currentQ) {
                const params = new URLSearchParams(searchParams.toString());
                if (searchQuery) {
                    params.set('q', searchQuery);
                } else {
                    params.delete('q');
                }
                params.set('page', '1');
                router.push(`/orders?${params.toString()}`);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, router, searchParams]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/orders?${params.toString()}`);
    };

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

    const page = pagination.page;
    const totalPages = pagination.totalPages;

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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {initialOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-[13px] text-muted-foreground">No orders found.</p>
                                    </td>
                                </tr>
                            ) : initialOrders.map((order: any) => {
                                const customerName = order.user?.name || 
                                    (order.shippingAddress && typeof order.shippingAddress === 'object' && (order.shippingAddress as any).name) || 
                                    'Guest';
                                const customerPhone = order.customerPhone || 
                                    (order.shippingAddress && typeof order.shippingAddress === 'object' && (order.shippingAddress as any).phone) || 
                                    '';
                                return (
                                    <tr 
                                        key={order.id} 
                                        onClick={() => router.push(`/orders/${order.id}`)}
                                        className="hover:bg-muted/10 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-[14px] font-bold text-foreground">#{order.orderNumber}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-[14px] font-semibold text-foreground">{customerName}</div>
                                            <div className="text-[12px] text-muted-foreground">{customerPhone || order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[13px] text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-[14px] font-bold text-foreground">৳{Number(order.totalAmount).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between">
                    <p className="text-[12px] text-muted-foreground">
                        Showing <span className="font-bold text-foreground">{initialOrders.length}</span> of <span className="font-bold text-foreground">{pagination.total}</span> orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(Math.max(page - 1, 1))}
                            disabled={page === 1}
                            className="p-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                            disabled={page === totalPages || totalPages === 0}
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
