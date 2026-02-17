'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Package,
    ChevronRight,
    Search,
    ArrowLeft,
    Loader2,
    ShoppingBag,
    Clock,
    CheckCircle2,
    Truck,
    X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { formatPrice } from '@/lib/utils'; // Assuming this utility exists

interface OrderItem {
    quantity: number;
    product: {
        name: string;
        slug: string;
        images: { url: string }[];
    };
}

interface OrderSummary {
    id: string;
    order_number: string;
    created_at: string;
    status: string;
    total_amount: number;
    order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
    processing: { label: 'Processing', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Loader2 },
    shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Truck },
    pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: X },
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function OrdersPage() {
    const { user, isLoaded } = useUser();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isLoaded) return;
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
        if (!query) return orders;

        return orders.filter((order) =>
            [order.order_number, order.status]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query))
        );
    }, [orders, searchTerm]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-luxury-gold">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest">Retrieving your history...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                <div>
                    <Link href="/account" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-luxury-black transition-colors mb-6 uppercase tracking-widest group">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-luxury-black font-playfair mb-4">
                        Order History
                    </h1>
                    <p className="text-gray-500 max-w-lg text-lg">
                        Track your recent purchases and view order details.
                    </p>
                </div>

                <div className="w-full md:w-auto relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-luxury-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by Order ID..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="w-full md:w-80 pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all shadow-sm"
                    />
                </div>
            </div>

            {errorMessage && (
                <div className="p-8 text-center bg-red-50 border border-red-100 rounded-lg mb-8">
                    <p className="text-red-600 font-medium mb-4">{errorMessage}</p>
                    <Button onClick={() => window.location.reload()} variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
                        Try Again
                    </Button>
                </div>
            )}

            {!errorMessage && filteredOrders.length === 0 ? (
                <div className="text-center py-32 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                        <ShoppingBag className="h-8 w-8 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold font-playfair text-gray-900 mb-2">No orders found</h2>
                    <p className="text-gray-500 mb-8">You haven't placed any orders matching your criteria yet.</p>
                    <Link href="/shop">
                        <Button className="bg-luxury-black text-white hover:bg-gray-800 rounded-sm px-8 h-12 uppercase tracking-widest text-xs font-bold">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => {
                        const status = statusConfig[order.status?.toLowerCase()] || statusConfig.pending;
                        const StatusIcon = status.icon;

                        return (
                            <div key={order.id} className="bg-white border border-gray-100 rounded-sm p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
                                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
                                                Order Number
                                            </span>
                                            <span className="font-bold text-luxury-black">#{order.order_number}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
                                                Date Placed
                                            </span>
                                            <span className="font-medium text-gray-900">{formatDate(order.created_at)}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
                                                Total Amount
                                            </span>
                                            <span className="font-bold text-luxury-gold font-playfair text-lg">
                                                {formatPrice(order.total_amount)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
                                                Status
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 shrink-0">
                                        <Link href={`/account/orders/${order.order_number}`}>
                                            {/* Note: changed to order_number assuming the detail page uses it */}
                                            <Button variant="outline" className="h-10 px-6 border-gray-200 hover:border-luxury-black hover:bg-luxury-black hover:text-white transition-all uppercase tracking-widest text-[10px] font-bold">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {order.order_items?.map((item, index) => (
                                            <Link
                                                key={index}
                                                href={`/products/${item.product?.slug || '#'}`}
                                                className="relative w-16 h-20 bg-gray-50 border border-gray-100 flex-shrink-0 hover:border-luxury-gold transition-colors"
                                                title={item.product?.name}
                                            >
                                                {item.product?.images?.[0]?.url ? (
                                                    <Image
                                                        src={item.product.images[0].url}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ShoppingBag className="h-6 w-6" />
                                                    </div>
                                                )}
                                                {item.quantity > 1 && (
                                                    <span className="absolute -top-2 -right-2 bg-luxury-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                                        {item.quantity}
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                        {(!order.order_items || order.order_items.length === 0) && (
                                            <span className="text-sm text-gray-400 italic">No items details available</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
