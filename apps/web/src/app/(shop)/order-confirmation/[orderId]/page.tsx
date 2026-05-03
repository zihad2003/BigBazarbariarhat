'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
    Check,
    Package, 
    Truck, 
    Calendar, 
    ArrowRight, 
    ShoppingBag, 
    Share2,
    MapPin,
    CreditCard,
    ShieldCheck,
    Facebook,
    Twitter,
    MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

export default function OrderConfirmationPage() {
    const params = useParams();
    const orderId = params.orderId as string;
    const [order, setOrder] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem('bigbazar-orders') || '[]');
        const foundOrder = orders.find((o: any) => o.id === orderId);
        if (foundOrder) {
            setOrder(foundOrder);
        }
        setIsLoaded(true);
        
        // Clear cart after showing the page as requested
        // Small timeout to ensure everything is rendered
        const timer = setTimeout(() => {
            clearCart();
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [orderId, clearCart]);

    if (!isLoaded) return null;

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-8">
                    <ShieldCheck className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Order Not Found</h1>
                <p className="text-gray-400 mb-10 max-w-sm font-medium">We couldn't locate this order in our records.</p>
                <Link href="/products">
                    <Button className="rounded-2xl px-10 h-16 bg-black text-white hover:bg-gray-800 transition-all font-black text-xs uppercase tracking-widest">
                        Back to Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 4); // Average 4 days

    return (
        <div className="bg-[#fafafa] min-h-screen pb-24 font-sans">
            <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
                
                {/* Success Animation Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="relative mb-10">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                            className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20"
                        >
                            <motion.div
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            >
                                <Check className="h-16 w-16 text-white stroke-[4px]" />
                            </motion.div>
                        </motion.div>
                        
                        {/* Orbiting Particles */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ 
                                    opacity: [0, 1, 0], 
                                    scale: [0, 1.2, 0],
                                    x: Math.cos(i * 60 * (Math.PI / 180)) * 100,
                                    y: Math.sin(i * 60 * (Math.PI / 180)) * 100
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-emerald-400 rounded-full"
                            />
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase mb-4">Order Placed Successfully!</h1>
                        <p className="text-gray-400 text-lg font-medium max-w-md mx-auto leading-relaxed">
                            Thank you for your purchase. We've received your order and our curators are already preparing your artifacts.
                        </p>
                        
                        <div className="mt-8 flex items-center justify-center gap-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Identifier</span>
                            <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 font-mono">
                                #BBB-{order.id.split('-').pop()}
                            </span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Summary Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
                            <Package className="h-5 w-5 text-indigo-600" />
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Acquisition Summary</h3>
                        </div>

                        {/* Items */}
                        <div className="space-y-8 mb-12">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-6 items-center">
                                    <div className="relative w-20 aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-50">
                                        <Image
                                            src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-1 right-1 bg-black text-white text-[8px] font-black px-1.5 py-0.5 rounded-lg">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-sm text-gray-900 uppercase tracking-tight line-clamp-1">{item.product.name}</h4>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{item.variant?.name || 'Standard Config'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-sm text-gray-900 font-mono">
                                            {formatPrice((item.product.salePrice || item.product.basePrice + (item.variant?.priceAdjustment || 0)) * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-gray-50">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <MapPin className="h-4 w-4" /> Delivery Coordinates
                                </div>
                                <div className="text-sm font-black text-gray-900 leading-relaxed uppercase tracking-tight">
                                    {order.shipping.fullName}<br />
                                    {order.shipping.address}<br />
                                    {order.shipping.upazila}, {order.shipping.district}<br />
                                    {order.shipping.division}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <CreditCard className="h-4 w-4" /> Authorization Channel
                                </div>
                                <div className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                    {order.payment.method === 'cod' ? 'Cash on Arrival' : order.payment.method.toUpperCase()}
                                    {order.payment.details?.bkashNumber && (
                                        <p className="text-[10px] text-gray-400 mt-1">WALLET: {order.payment.details.bkashNumber}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Total Paid */}
                        <div className="mt-12 p-8 bg-gray-50 rounded-[2rem] flex items-center justify-between border border-gray-100">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Authorized Total</p>
                                <p className="text-3xl font-black text-gray-900 font-mono tracking-tighter">{formatPrice(order.totals.total)}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Synchronized</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Including {formatPrice(order.totals.shippingCost)} Logistics</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar Actions */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                            className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[5rem] group-hover:scale-110 transition-transform -mr-12 -mt-12" />
                            
                            <div className="flex items-center gap-4 mb-8">
                                <Truck className="h-6 w-6 text-indigo-400" />
                                <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Logistics Hub</h3>
                            </div>

                            <div className="space-y-6 mb-10">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Estimated Arrival</p>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-emerald-400" />
                                        <span className="text-xl font-black tracking-tight">{estimatedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
                                    Our logistics matrix is calculating the optimal transit route for your artifacts.
                                </p>
                            </div>

                            <Link href={`/orders/${order.id}`}>
                                <Button className="w-full h-16 bg-white text-black hover:bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl">
                                    Track Manifest <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.1 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 text-center space-y-6"
                        >
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-3">
                                <Share2 className="h-4 w-4" /> Share your Curation
                            </h4>
                            <div className="flex items-center justify-center gap-4">
                                <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                                    <Facebook className="h-5 w-5" />
                                </button>
                                <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sky-50 hover:text-sky-500 transition-all border border-transparent hover:border-sky-100">
                                    <Twitter className="h-5 w-5" />
                                </button>
                                <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all border border-transparent hover:border-emerald-100">
                                    <MessageCircle className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.3 }}
                            className="flex justify-center"
                        >
                            <Link href="/products" className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest border-b border-gray-100 hover:border-black pb-2 transition-all">
                                Continue Exploration
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
