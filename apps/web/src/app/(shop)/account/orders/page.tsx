'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Package,
    ChevronRight,
    Search,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

interface OrderSummary {
    id: string;
    order_number: string;
    created_at: string;
    status: string;
    total_amount: number | null;
    order_items?: Array<{ count?: number }> | { count?: number } | null;
}

const statusStyles: Record<string, string> = {
    delivered: 'bg-green-100 text-green-600',
    processing: 'bg-amber-100 text-amber-600',
    shipped: 'bg-indigo-100 text-indigo-600',
    pending: 'bg-gray-100 text-gray-500',
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const formatCurrency = (value: number) => `৳${value.toLocaleString()}`;

const getItemCount = (order: OrderSummary) => {
    if (!order.order_items) {
        return 0;
    }

    if (Array.isArray(order.order_items)) {
        const [first] = order.order_items;
        if (first && typeof first === 'object' && 'count' in first) {
            return first.count ?? 0;
        }
        return order.order_items.length;
    }

    return order.order_items.count ?? 0;
};

export default function OrdersPage() {
    const { user, isLoaded } = useUser();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isLoaded) {
                return;
            }

            if (!user) {
                setOrders([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setErrorMessage(null);

            try {
                const response = await fetch(`/api/orders?userId=${user.id}`);
                const result = await response.json();

                if (result.success) {
                    setOrders(result.data || []);
                } else {
                    setErrorMessage(result.error || 'Unable to load your orders.');
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                setErrorMessage('Unable to load your orders right now.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isLoaded, user]);

    const filteredOrders = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) {
            return orders;
        }

        return orders.filter((order) =>
            [order.order_number, order.status]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query))
        );
    }, [orders, searchTerm]);

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-4 uppercase tracking-widest">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Order History</h1>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-64 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Find an order..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-base focus:outline-none focus:bg-white focus:border-gray-200 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="hidden md:grid grid-cols-6 gap-4 p-8 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <div className="col-span-1">Order #</div>
                    <div className="col-span-1">Date</div>
                    <div className="col-span-1">Items</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Total</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {loading && (
                    <div className="p-8 space-y-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                                <div className="h-6 bg-gray-100 rounded-xl w-32" />
                                <div className="hidden md:block h-6 bg-gray-100 rounded-xl w-24" />
                                <div className="hidden md:block h-6 bg-gray-100 rounded-xl w-20" />
                                <div className="h-6 bg-gray-100 rounded-xl w-24" />
                                <div className="h-6 bg-gray-100 rounded-xl w-24" />
                                <div className="hidden md:block h-6 bg-gray-100 rounded-xl w-20 ml-auto" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && errorMessage && (
                    <div className="px-8 py-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Package className="h-8 w-8 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-4">We couldn't load your orders</h2>
                        <p className="text-gray-500 mb-8 text-lg font-medium">{errorMessage}</p>
                        <Button onClick={() => window.location.reload()} className="bg-black text-white hover:bg-gray-800 rounded-2xl px-10 h-14 text-lg font-bold">
                            Try Again
                        </Button>
                    </div>
                )}

                {!loading && !errorMessage && (
                    <div className="divide-y divide-gray-50">
                        {filteredOrders.map((order) => {
                            const statusKey = order.status?.toLowerCase() || 'pending';
                            const itemCount = getItemCount(order);
                            const totalValue = order.total_amount ?? 0;

                            return (
                                <div key={order.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-8 items-center hover:bg-gray-50 transition-colors group">
                                    <div className="col-span-1">
                                        <span className="font-black text-gray-900">#{order.order_number}</span>
                                        <div className="md:hidden text-xs text-gray-400 font-bold mt-1">{formatDate(order.created_at)}</div>
                                    </div>
                                    <div className="col-span-1 hidden md:block">
                                        <span className="font-bold text-gray-600">{formatDate(order.created_at)}</span>
                                    </div>
                                    <div className="col-span-1 hidden md:block">
                                        <span className="font-bold text-gray-900">{itemCount} Products</span>
                                    </div>
                                    <div className="col-span-1">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyles[statusKey] || statusStyles.pending}`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </div>
                                    <div className="col-span-1">
                                        <span className="font-black text-lg text-gray-900">{formatCurrency(totalValue)}</span>
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <Button variant="ghost" className="rounded-xl font-bold gap-2 hover:bg-black hover:text-white transition-all">
                                            Details
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {!loading && !errorMessage && filteredOrders.length === 0 && (
                <div className="text-center py-40 bg-gray-50 rounded-[4rem] mt-12">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Package className="h-10 w-10 text-gray-200" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">No Orders Yet</h2>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg font-medium">
                        You haven't placed any orders yet. Start shopping to see your history here!
                    </p>
                    <Link href="/shop">
                        <Button className="bg-black text-white hover:bg-gray-800 rounded-2xl px-12 h-16 text-lg font-bold shadow-xl shadow-black/10">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            )}

            {!isLoaded && (
                <div className="mt-12 flex items-center justify-center gap-3 text-gray-400 font-bold">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading your account...
                </div>
            )}
        </div>
    );
}
