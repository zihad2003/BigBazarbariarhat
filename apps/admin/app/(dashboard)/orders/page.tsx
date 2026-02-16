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
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/orders?page=${page}&limit=10&q=${searchQuery}`);
            if (!res.ok) throw new Error('Failed to connect to server');

            const result = await res.json();
            if (result.success) {
                setOrders(result.data || []);
                if (result.pagination) {
                    setPagination({
                        page: result.pagination.page,
                        totalPages: result.pagination.totalPages,
                        totalItems: result.pagination.total
                    });
                } else {
                    setPagination({ page: 1, totalPages: 1, totalItems: result.data?.length || 0 });
                }
            } else {
                throw new Error(result.error || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setError('Could not retrieve logistics data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(1);
    }, [searchQuery]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'PROCESSING': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
            case 'SHIPPED': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'DELIVERED': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'CANCELLED': return 'bg-rose-100 text-rose-600 border-rose-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="h-3 w-3" />;
            case 'PROCESSING': return <Package className="h-3 w-3" />;
            case 'SHIPPED': return <Truck className="h-3 w-3" />;
            case 'DELIVERED': return <CheckCircle2 className="h-3 w-3" />;
            case 'CANCELLED': return <XCircle className="h-3 w-3" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Fulfillment</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">Oversee logistics and customer transactions</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => alert('Export feature coming soon!')}
                        className="px-8 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-md transition-all flex items-center gap-3"
                    >
                        <Download className="h-4 w-4" />
                        Export Logistics
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Trace order by ID, customer name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-base focus:outline-none focus:bg-white focus:border-gray-100 transition-all font-bold"
                        />
                    </div>
                    <button className="px-8 py-4 border-2 border-gray-50 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:border-black transition-all">
                        <Filter className="h-5 w-5" />
                        Date Filter
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction UID</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Client Identity</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Temporal</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Value</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fulfillment Node</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Remittance</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Interaction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {error ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                            <XCircle className="h-10 w-10 text-rose-500" />
                                        </div>
                                        <p className="text-gray-900 font-bold mb-2">Connection Failure</p>
                                        <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">{error}</p>
                                        <button
                                            onClick={() => fetchOrders(pagination.page)}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs"
                                        >
                                            Retry Connection
                                        </button>
                                    </td>
                                </tr>
                            ) : loading ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center">
                                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-600" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-4">Synchronizing Transactions...</p>
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/80 transition-all group">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-gray-900 tracking-tighter">#{order.orderNumber}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-gray-900">{order.user?.firstName || order.guestName || 'Anonymous'}</div>
                                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{order.user?.email || order.guestEmail}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm text-gray-600 font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-base font-black text-gray-900">৳{order.totalAmount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-200`}>
                                            {order.paymentMethod?.replace(/_/g, ' ') || 'COD'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                            <Link href={`/orders/${order.id}`}>
                                                <button className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl hover:bg-black hover:text-white transition-all">
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                            </Link>
                                            <button className="p-3 bg-white shadow-sm border border-gray-100 rounded-xl hover:bg-gray-100 transition-all">
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={7} className="py-40 text-center">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Package className="h-12 w-12 text-gray-200" />
                                        </div>
                                        <h4 className="text-2xl font-black text-gray-900">No Orders Found</h4>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Try adjusting your search filters</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-10 py-8 bg-gray-50/30 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                        Visualizing <span className="text-gray-900">{orders.length}</span> Transaction Nodes
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 border-2 border-gray-200 rounded-2xl hover:bg-black hover:text-white transition-all disabled:opacity-30" disabled>
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button className="w-12 h-12 rounded-2xl font-black text-sm bg-black text-white shadow-xl">1</button>
                        <button className="p-3 border-2 border-gray-200 rounded-2xl hover:bg-black hover:text-white transition-all disabled:opacity-30" disabled>
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
