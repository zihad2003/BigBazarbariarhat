'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
    CheckCircle2,
    ArrowRight,
    ShoppingBag,
    Calendar,
    CreditCard,
    MapPin,
    Loader2,
    Package,
    ShieldCheck,
    X,
    Heart,
    Star,
    Sparkles,
    ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// Refined falling particles logic
function SuccessParticles() {
    const [particles, setParticles] = useState<Array<{ id: number; left: string; size: number; duration: number; delay: number; color: string }>>([]);

    useEffect(() => {
        const colors = ['#000000', '#6366f1', '#10b981', '#f59e0b'];
        const newParticles = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}vw`,
            size: Math.random() * 6 + 2,
            duration: Math.random() * 3 + 3,
            delay: Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{
                        y: ['0vh', '110vh'],
                        opacity: [0, 1, 1, 0],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: "linear",
                        repeat: Infinity
                    }}
                    className="absolute"
                    style={{
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: i % 2 === 0 ? '50%' : '2px'
                    }}
                />
            ))}
        </div>
    );
}

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderId');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (orderNumber) {
            const fetchOrder = async () => {
                try {
                    const res = await fetch(`/api/orders/${orderNumber}`);
                    const result = await res.json();
                    if (result.success) {
                        setOrder(result.data);
                    } else {
                        setErrorMessage(result.error || 'We could not verify this order.');
                    }
                } catch (error) {
                    console.error('Error fetching order details:', error);
                    setErrorMessage('We could not load the order details. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };
            fetchOrder();
        } else {
            setErrorMessage('Missing order reference. Please check your confirmation email.');
            setLoading(false);
        }
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-8 bg-white">
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-24 w-24 rounded-[2.5rem] border-4 border-gray-50 border-t-black animate-spin"
                    />
                    <ShoppingBag className="h-10 w-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Securing Transaction</p>
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest animate-pulse">Wait for authorization</p>
                </div>
            </div>
        );
    }

    if (errorMessage || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-rose-100 shadow-xl shadow-rose-500/5">
                        <ShieldCheck className="h-10 w-10 text-rose-500" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Verification Failed</h1>
                    <p className="text-gray-500 text-lg font-medium mb-12 leading-relaxed">
                        {errorMessage || 'The requested order could not be authenticated.'}
                    </p>
                    <div className="flex flex-col gap-4">
                        <Link href="/account/orders">
                            <Button className="h-16 w-full bg-black text-white hover:bg-gray-800 rounded-2xl uppercase tracking-widest font-black text-sm shadow-xl shadow-black/10">
                                Order Archives
                            </Button>
                        </Link>
                        <Link href="/shop">
                            <Button variant="ghost" className="h-16 w-full text-gray-400 hover:text-black font-black uppercase tracking-widest text-xs">
                                Return to Market
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const isPaid = order.paymentStatus === 'PAID';

    return (
        <div className="min-h-screen bg-[#fafafa] relative overflow-hidden pb-24">
            <SuccessParticles />

            {/* Top Navigation Bar (Fixed simplified) */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/shop" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors group">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Market
                    </Link>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Transaction Secured</span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-16">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 rounded-[2.5rem] mb-8 border border-emerald-100 shadow-xl shadow-emerald-500/10"
                    >
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 tracking-tighter"
                    >
                        Success<span className="text-emerald-500">.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-medium"
                    >
                        Your acquisition has been authenticated. We are preparing your artifacts for secure shipment.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Reference</span>
                            <span className="text-sm font-black text-gray-900 tracking-wider">#{orderNumber}</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authenticated on</span>
                            <span className="text-sm font-black text-gray-900">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Summary & Items */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Summary Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white border border-gray-100 rounded-[3rem] p-8 lg:p-12 shadow-sm"
                        >
                            <div className="flex items-center justify-between border-b border-gray-50 pb-8 mb-8">
                                <h3 className="text-2xl font-black text-gray-900">Acquisition Summary</h3>
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <Package className="h-3 w-3" />
                                    {order.items.length} Artifacts
                                </div>
                            </div>

                            <div className="space-y-10">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-8 items-start group">
                                        <div className="w-full sm:w-28 aspect-[3/4] bg-gray-50 rounded-[1.5rem] relative shrink-0 overflow-hidden border border-gray-100">
                                            {item.product?.images?.[0]?.url ? (
                                                <Image
                                                    src={item.product.images[0].url}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Package className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-2">
                                            <div className="flex justify-between items-start gap-4 mb-3">
                                                <h4 className="font-black text-gray-900 text-xl leading-tight line-clamp-2">{item.product?.name}</h4>
                                                <p className="font-black text-gray-900 text-xl shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
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
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 pt-12 border-t border-gray-50 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Total Asset Value</span>
                                    <span className="font-black text-lg text-gray-900 font-mono tracking-tighter">৳{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Secure Courier</span>
                                    <span className="font-black text-lg text-gray-900 font-mono tracking-tighter">৳{order.shippingCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-end pt-8 border-t border-gray-50 mt-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Authenticated Total</p>
                                        <h4 className="text-5xl font-black text-gray-900 tracking-tighter font-mono">৳{order.totalAmount.toLocaleString()}</h4>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="bg-emerald-50 text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                            Transaction Complete
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Primary Actions */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link href="/shop" className="flex-1">
                                <Button className="w-full h-20 bg-black text-white hover:bg-gray-800 transition-all rounded-[1.5rem] uppercase tracking-widest font-black text-sm shadow-2xl shadow-black/20 group">
                                    <ShoppingBag className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                                    Continue Shopping
                                </Button>
                            </Link>
                            <Link href="/account/orders" className="flex-1">
                                <Button variant="outline" className="w-full h-20 border-gray-200 hover:border-black text-gray-900 bg-white rounded-[1.5rem] uppercase tracking-widest font-black text-sm group shadow-sm transition-all hover:shadow-lg">
                                    Manage Archive
                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Meta Details */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Destination Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[5rem] group-hover:scale-110 transition-transform -mr-10 -mt-10" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-indigo-500" />
                                Delivery Destination
                            </h4>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="font-black text-gray-900 text-xl mb-2">{order.guestName}</p>
                                    <div className="space-y-1 text-gray-500 font-bold leading-relaxed">
                                        <p>{order.guestAddress?.addressLine1}</p>
                                        <p>{order.guestAddress?.city}</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-50">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <CreditCard className="h-3 w-3" />
                                        Instrument
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-black text-gray-900 uppercase tracking-tight">{order.paymentMethod?.replace(/_/g, ' ')}</p>
                                        {isPaid && (
                                            <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" /> Paid
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Timeline & Shield */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-tl-[5rem] group-hover:scale-110 transition-transform" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-8 flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-emerald-400" />
                                Dispatch window
                            </h4>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Estimated Window</p>
                                    <p className="text-2xl font-black">2-4 Business Days</p>
                                    <p className="text-sm text-gray-500 mt-2 font-medium">Standard Logistics Dispatch</p>
                                </div>
                                <div className="pt-8 border-t border-white/10 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                        <ShieldCheck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Protection Active</p>
                                        <p className="text-xs font-bold text-gray-300">Package Insured & Tracked</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Support Info */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 text-center">
                            <h5 className="font-black text-gray-900 mb-2">Requirement assistance?</h5>
                            <p className="text-xs text-gray-400 font-bold mb-6">Our global concierge is standing by.</p>
                            <a
                                href="mailto:concierge@bigbazar.com"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-black transition-colors"
                            >
                                Contact Concierge <ArrowRight className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="h-12 w-12 animate-spin text-black" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 animate-pulse">Initializing Interface</p>
                </div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
