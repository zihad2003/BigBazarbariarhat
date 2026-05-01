'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    CheckCircle2,
    ArrowLeft,
    ShoppingBag,
    Calendar,
    CreditCard,
    MapPin,
    Loader2,
    Package,
    Truck,
    Clock,
    X,
    Printer,
    Download,
    HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function OrderDetailsPage({ params }: { params: Promise<{ orderNumber: string }> }) {
    const { orderNumber } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${orderNumber}`);
                const result = await res.json();
                if (result.success) {
                    setOrder(result.data);
                } else {
                    setErrorMessage(result.error || 'We could not load this order.');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                setErrorMessage('We could not load the order details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-6 bg-white">
                <div className="relative">
                    <div className="h-20 w-20 rounded-3xl border-4 border-gray-50 border-t-black animate-spin" />
                    <ShoppingBag className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black" />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs animate-pulse text-center">
                    Authenticating Order<br /><span className="text-[10px] mt-1 block">#{orderNumber}</span>
                </p>
            </div>
        );
    }

    if (errorMessage || !order) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center py-20 px-6">
                <div className="max-w-md w-full text-center">
                    <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-rose-100">
                        <X className="h-10 w-10 text-rose-500" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Not Found</h1>
                    <p className="text-gray-500 text-lg font-medium mb-12 leading-relaxed">
                        {errorMessage || 'The requested order could not be located in our archives.'}
                    </p>
                    <Link href="/account/orders">
                        <Button className="h-16 w-full bg-black text-white hover:bg-gray-800 rounded-2xl uppercase tracking-widest font-black text-sm shadow-xl shadow-black/10">
                            Return to Collection
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
        delivered: { label: 'Delivered', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
        processing: { label: 'Processing', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Loader2 },
        shipped: { label: 'Shipped', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Truck },
        pending: { label: 'Pending', color: 'bg-gray-50 text-gray-600 border-gray-100', icon: Clock },
        cancelled: { label: 'Cancelled', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: X },
    };

    const status = statusConfig[order.status?.toLowerCase()] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <div className="min-h-screen py-12 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-4 uppercase tracking-widest group">
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to History
                        </Link>
                        <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-4">
                            Order <span className="text-gray-400">#</span>{order.order_number}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-bold text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black border uppercase tracking-widest ${status.color}`}>
                                <StatusIcon className={`h-4 w-4 ${order.status === 'processing' ? 'animate-spin' : ''}`} />
                                {status.label}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 w-full md:w-auto"
                    >
                        <Button variant="outline" className="flex-1 md:flex-none h-14 px-8 border-gray-200 hover:border-black rounded-2xl uppercase tracking-widest font-black text-xs gap-3 bg-white shadow-sm">
                            <Printer className="h-4 w-4" />
                            Invoice
                        </Button>
                        <Button className="flex-1 md:flex-none h-14 px-8 bg-black text-white hover:bg-gray-800 rounded-2xl uppercase tracking-widest font-black text-xs shadow-xl shadow-black/10">
                            Support
                        </Button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content - Items */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-8 space-y-12"
                    >
                        <div className="bg-white border border-gray-100 rounded-[3rem] p-8 lg:p-12 shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-8 mb-8">
                                <h3 className="text-2xl font-black text-gray-900">Items Selection</h3>
                                <span className="bg-gray-50 text-gray-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                    {order.items?.length || 0} Products
                                </span>
                            </div>

                            <div className="space-y-10">
                                {order.items?.map((item: any, idx: number) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-8 items-start group">
                                        <Link href={`/products/${item.product?.slug || '#'}`} className="block w-full sm:w-32 aspect-[3/4] bg-gray-50 rounded-[2rem] relative shrink-0 overflow-hidden border border-gray-100 group-hover:shadow-xl transition-all duration-500">
                                            {item.product?.images?.[0]?.url ? (
                                                <Image
                                                    src={item.product.images[0].url}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Package className="w-10 h-10" />
                                                </div>
                                            )}
                                        </Link>
                                        <div className="flex-1 min-w-0 pt-2 pb-2">
                                            <div className="flex justify-between items-start gap-4 mb-2">
                                                <Link href={`/products/${item.product?.slug || '#'}`}>
                                                    <h4 className="font-black text-gray-900 text-2xl group-hover:text-indigo-600 transition-colors line-clamp-2">{item.product?.name}</h4>
                                                </Link>
                                                <div className="text-right shrink-0">
                                                    <p className="font-black text-gray-900 text-2xl">৳{(item.unit_price * item.quantity).toLocaleString()}</p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Total</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                                {item.variant?.attributes?.size && (
                                                    <span className="bg-gray-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100">
                                                        Size: {item.variant.attributes.size}
                                                    </span>
                                                )}
                                                {item.variant?.attributes?.color && (
                                                    <span className="bg-gray-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100">
                                                        Color: {item.variant.attributes.color}
                                                    </span>
                                                )}
                                                <span className="bg-indigo-50 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-500 border border-indigo-100">
                                                    QTY: {item.quantity}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-4 font-bold uppercase tracking-widest">
                                                Unit Price: ৳{item.unit_price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-12 border-t border-gray-50 space-y-4">
                                <div className="flex justify-between items-center text-gray-400">
                                    <span className="text-sm font-bold uppercase tracking-widest">Archive Subtotal</span>
                                    <span className="font-black text-lg text-gray-900">৳{order.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span className="text-sm font-bold uppercase tracking-widest">Secure Shipping</span>
                                    <span className="font-black text-lg text-gray-900">৳{order.shipping_cost?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span className="text-sm font-bold uppercase tracking-widest">Applied Tax</span>
                                    <span className="font-black text-lg text-gray-900">৳{order.tax_amount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-end pt-8 border-t border-gray-50 mt-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Authenticated Total</p>
                                        <h4 className="text-5xl font-black text-gray-900 tracking-tighter">৳{order.total_amount?.toLocaleString()}</h4>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                                            <CheckCircle2 className="h-4 w-4" />
                                            {order.payment_status === 'paid' ? 'Authenticated' : 'Pending Verification'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar - Delivery & Payment */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4 space-y-8"
                    >
                        {/* Delivery Section */}
                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] group-hover:scale-110 transition-transform -mr-10 -mt-10" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-indigo-500" />
                                Delivery Destination
                            </h4>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="font-black text-gray-900 text-xl mb-2">{order.guest_name || 'Valued Client'}</p>
                                    <div className="space-y-1 text-gray-500 font-bold leading-relaxed">
                                        <p>{order.guest_address?.address_line1}</p>
                                        {order.guest_address?.address_line2 && <p>{order.guest_address?.address_line2}</p>}
                                        <p>{order.guest_address?.city}, {order.guest_address?.postal_code}</p>
                                        <p className="uppercase tracking-widest text-xs text-indigo-600 pt-2">{order.guest_address?.country}</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-50">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Secure Contact</p>
                                    <p className="font-black text-gray-900 tracking-wider">{order.guest_phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-tl-[8rem] group-hover:bg-white/10 transition-colors" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 flex items-center gap-3">
                                <CreditCard className="h-4 w-4 text-emerald-400" />
                                Payment Instrument
                            </h4>

                            <div className="space-y-8 relative z-10">
                                <div>
                                    <p className="text-2xl font-black mb-2 uppercase tracking-tight">
                                        {order.payment_method?.replace(/_/g, ' ') || 'CREDIT CARD'}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${order.payment_status === 'paid'
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                            }`}>
                                            {order.payment_status?.toUpperCase() || 'PENDING'}
                                        </span>
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Method Verified</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                            <Package className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Secure Transaction ID</p>
                                            <p className="text-xs font-mono font-bold text-gray-300">TXN-{order.id?.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 flex items-center gap-6 group cursor-pointer hover:border-black transition-colors">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                <HelpCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <h5 className="font-black text-gray-900">Need Assistance?</h5>
                                <p className="text-xs text-gray-400 font-bold mt-1">Our concierge is ready to help 24/7.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
