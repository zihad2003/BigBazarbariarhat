'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
    CheckCircle2,
    ArrowRight,
    ShoppingBag,
    Calendar,
    Box,
    CreditCard,
    MapPin,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderId');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderNumber) {
            // Fetch order details for confirmation
            const fetchOrder = async () => {
                try {
                    // We might need a specific endpoint for order lookup by number
                    const res = await fetch(`/api/orders/${orderNumber}`);
                    const result = await res.json();
                    if (result.success) {
                        setOrder(result.data);
                    }
                } catch (error) {
                    console.error('Error fetching order details:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="h-16 w-16 animate-spin text-indigo-600" />
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Confirming your Masterpiece...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-40">
            <div className="max-w-4xl mx-auto px-6 text-center">
                {/* Success Icon */}
                <div className="relative inline-block mb-12">
                    <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                    <div className="relative w-32 h-32 bg-green-500 text-white rounded-[2.5rem] rotate-12 flex items-center justify-center shadow-2xl shadow-green-500/40 mx-auto">
                        <CheckCircle2 className="h-16 w-16 -rotate-12" />
                    </div>
                </div>

                <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tighter">
                    Magnificent Choice.
                </h1>
                <p className="text-xl text-gray-500 mb-16 leading-relaxed max-w-2xl mx-auto">
                    Your order has been secured. Our curators are already preparing your items for their journey to your doorstep.
                </p>

                {/* Order Details Card */}
                <div className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 mb-16 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[15rem] opacity-30 -mr-10 -mt-10" />

                    <div className="relative">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-10 border-b border-gray-50">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Order Token</p>
                                <h2 className="text-4xl font-black text-black tracking-tighter">#{orderNumber || 'PENDING'}</h2>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="px-6 py-2 bg-green-100 text-green-600 rounded-2xl text-xs font-black border border-green-200 uppercase tracking-widest mb-2">Authenticated</span>
                                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <div className="space-y-10">
                                <div className="flex gap-6 items-start group">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                        <Calendar className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-1">Acquisition Date</h3>
                                        <p className="text-lg font-black text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start group">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                        <Box className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-1">Logistics Velocity</h3>
                                        <p className="text-lg font-black text-gray-900">Standard Express (2-4 Days)</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">Real-time tracking available soon</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="flex gap-6 items-start group">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                        <CreditCard className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-1">Remittance Status</h3>
                                        <p className="text-lg font-black text-gray-900">{order?.paymentMethod?.replace(/_/g, ' ') || 'Cash on Delivery'}</p>
                                        <span className="text-[10px] text-green-500 font-black uppercase tracking-tighter">Verified Authorization</span>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start group">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                        <MapPin className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-1">Delivery Destination</h3>
                                        <p className="text-lg font-black text-gray-900">{order?.guestName || 'Valued Customer'}</p>
                                        <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">{order?.guestAddress?.addressLine1 || 'Your saved primary address'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/shop" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto h-20 px-12 bg-black text-white hover:bg-gray-800 rounded-3xl text-xl font-black shadow-2xl shadow-black/20 gap-4 active:scale-[0.98] transition-all">
                            <ShoppingBag className="h-7 w-7" />
                            Continue Curating
                        </Button>
                    </Link>
                    <Link href="/account/orders" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto h-20 px-12 border-4 border-gray-100 rounded-3xl text-xl font-black gap-4 group hover:bg-black hover:text-white hover:border-black active:scale-[0.98] transition-all">
                            Trace Journey
                            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-3" />
                        </Button>
                    </Link>
                </div>

                <div className="mt-20 flex items-center justify-center gap-10 opacity-30">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted</div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <div className="text-[10px] font-black uppercase tracking-[0.3em]">Authenticated</div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full" />
                    <div className="text-[10px] font-black uppercase tracking-[0.3em]">Verified</div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
