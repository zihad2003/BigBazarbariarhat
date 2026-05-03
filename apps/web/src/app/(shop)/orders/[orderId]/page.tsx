'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
    CheckCircle2, 
    Package, 
    Truck, 
    Calendar, 
    ArrowLeft, 
    ShoppingBag, 
    Download, 
    Printer,
    MapPin,
    CreditCard,
    ShieldCheck,
    Clock,
    RefreshCcw,
    XCircle,
    ChevronRight,
    Map
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';
import { MOCK_ORDERS, OrderStatus } from '@/lib/mock-data/orders';

const STATUS_CONFIG: Record<string, { color: string, bg: string, icon: any, label: string }> = {
    placed: { color: 'text-gray-400', bg: 'bg-gray-50', icon: Clock, label: 'Order Placed' },
    pending: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, label: 'Awaiting Authorization' },
    processing: { color: 'text-blue-600', bg: 'bg-blue-50', icon: RefreshCcw, label: 'Artifact Curation' },
    shipped: { color: 'text-orange-600', bg: 'bg-orange-50', icon: Truck, label: 'Logistics Transit' },
    delivered: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2, label: 'Successfully Delivered' },
    cancelled: { color: 'text-rose-600', bg: 'bg-rose-50', icon: XCircle, label: 'Manifest Cancelled' },
    out_for_delivery: { color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Map, label: 'Out for Deployment' }
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.orderId as string;
    const [order, setOrder] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const localOrders = JSON.parse(localStorage.getItem('bigbazar-orders') || '[]');
        const allOrders = [...MOCK_ORDERS, ...localOrders];
        const foundOrder = allOrders.find((o: any) => o.id === orderId || o.id === `ORD-${orderId}` || o.id === `BBB-${orderId}`);
        
        if (foundOrder) {
            setOrder(foundOrder);
        }
        setIsLoaded(true);
    }, [orderId]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <RefreshCcw className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-8">
                    <ShieldCheck className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Manifest Not Found</h1>
                <p className="text-gray-400 mb-10 max-w-sm font-medium">The order identifier provided does not match our authorized records.</p>
                <Link href="/account/orders">
                    <Button className="rounded-2xl px-10 h-16 bg-black text-white hover:bg-gray-800 transition-all font-black text-xs uppercase tracking-widest">
                        Back to Manifests
                    </Button>
                </Link>
            </div>
        );
    }

    const currentStatusConfig = STATUS_CONFIG[order.status];

    return (
        <div className="bg-[#fafafa] min-h-screen pb-24 font-sans">
            <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
                
                {/* Navigation & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <button onClick={() => router.back()} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to History
                    </button>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest border-gray-100 gap-2">
                            <Download className="h-4 w-4" /> Download Manifest
                        </Button>
                        <Button variant="outline" className="rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest border-gray-100 gap-2">
                            <Printer className="h-4 w-4" /> Print Invoice
                        </Button>
                    </div>
                </div>

                {/* Status Hero */}
                <section className="bg-white rounded-[3rem] p-10 lg:p-16 border border-gray-100 shadow-sm mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-bl-[10rem] -mr-20 -mt-20 pointer-events-none" />
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-black text-gray-900 tracking-tighter font-mono">#{order.id}</h1>
                                <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", currentStatusConfig.bg, currentStatusConfig.color)}>
                                    {currentStatusConfig.label}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4" /> Placed on {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="h-4 w-4" /> {order.items.length} Artifacts
                                </div>
                                <div className="flex items-center gap-3 text-emerald-500">
                                    <ShieldCheck className="h-4 w-4" /> Authenticated Protocol
                                </div>
                            </div>
                        </div>
                        <div className="text-left lg:text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Authenticated Value</p>
                            <p className="text-5xl font-black text-gray-900 tracking-tighter font-mono">{formatPrice(order.total)}</p>
                        </div>
                    </div>

                    {/* Timeline Stepper */}
                    <div className="mt-20 pt-20 border-t border-gray-50">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { id: 'placed', label: 'Placed', icon: Clock },
                                { id: 'pending', label: 'Confirmed', icon: ShieldCheck },
                                { id: 'processing', label: 'Curation', icon: Package },
                                { id: 'shipped', label: 'In Transit', icon: Truck },
                                { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
                            ].map((step, idx) => {
                                const stepInfo = order.timeline?.find((t: any) => t.status === step.id) || 
                                                (order.status === step.id ? { completed: true, date: 'Processing', time: '' } : null);
                                const isCompleted = stepInfo?.completed || 
                                                  ['pending', 'processing', 'shipped', 'delivered'].slice(['placed', 'pending', 'processing', 'shipped', 'delivered'].indexOf(step.id)).includes(order.status) && idx <= ['placed', 'pending', 'processing', 'shipped', 'delivered'].indexOf(order.status);
                                const isCurrent = order.status === step.id;

                                return (
                                    <div key={step.id} className="relative space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10",
                                                isCompleted ? "bg-black text-white shadow-xl shadow-black/10" : "bg-gray-50 text-gray-300 border border-gray-100"
                                            )}>
                                                <step.icon className={cn("h-5 w-5", isCurrent && "animate-pulse")} />
                                            </div>
                                            {idx < 4 && (
                                                <div className="hidden md:block absolute left-12 right-[-1rem] top-6 h-[2px] bg-gray-50 -z-0">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: isCompleted ? '100%' : '0%' }}
                                                        className="h-full bg-black"
                                                        transition={{ duration: 1, delay: idx * 0.2 }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className={cn("text-[10px] font-black uppercase tracking-widest", isCompleted ? "text-gray-900" : "text-gray-300")}>{step.label}</p>
                                            {stepInfo?.date && (
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stepInfo.date}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left: Artifact List */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-12">Artifact Manifest</h3>
                            <div className="space-y-10">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-8 group">
                                        <div className="relative w-32 aspect-[3/4] bg-gray-50 rounded-[2rem] overflow-hidden shrink-0 border border-gray-50">
                                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center py-2">
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{item.variantId ? `CONFIG: ${item.variantId}` : 'STANDARD CONFIG'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-gray-900 font-mono tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.quantity} × {formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 pt-4 border-t border-gray-50 mt-4">
                                                <Button variant="ghost" className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black">
                                                    View Artifact <ChevronRight className="h-3 w-3 ml-2" />
                                                </Button>
                                                <Button variant="ghost" className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                                                    Submit Report
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Logistics & Transaction */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* Destination Coordinates */}
                        <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-10">
                                <MapPin className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Destination</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Recipient</p>
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-relaxed">
                                        {order.shippingAddress.fullName}<br />
                                        {order.shippingAddress.phone}
                                    </p>
                                </div>
                                <div className="pt-6 border-t border-gray-50">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Physical Coordinates</p>
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight leading-relaxed">
                                        {order.shippingAddress.address}<br />
                                        {order.shippingAddress.upazila}, {order.shippingAddress.district}<br />
                                        {order.shippingAddress.division}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Transaction Protocol */}
                        <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-10">
                                <CreditCard className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Protocol</h3>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Channel</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white text-[10px] font-black uppercase">
                                            {order.paymentMethod.includes('bKash') ? 'bK' : order.paymentMethod.includes('Nagad') ? 'Na' : '৳'}
                                        </div>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{order.paymentMethod}</p>
                                    </div>
                                </div>
                                
                                <div className="pt-8 border-t border-gray-50 space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Initial Value</span>
                                        <span className="text-gray-900 font-mono">{formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Logistics Transit</span>
                                        <span className="text-gray-900 font-mono">{formatPrice(order.shippingCost)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                            <span>Adjustment</span>
                                            <span className="font-mono">-{formatPrice(order.discount)}</span>
                                        </div>
                                    )}
                                    <div className="pt-6 mt-6 border-t border-dashed border-gray-200">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Authenticated Total</p>
                                                <h4 className="text-3xl font-black text-gray-900 tracking-tighter font-mono">{formatPrice(order.total)}</h4>
                                            </div>
                                            <ShieldCheck className="h-8 w-8 text-indigo-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <Button className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20">
                                Contact Support Node
                            </Button>
                            {order.status === 'delivered' && (
                                <Button variant="outline" className="w-full h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest border-gray-100 hover:border-black transition-all">
                                    Initiate Return Matrix
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
