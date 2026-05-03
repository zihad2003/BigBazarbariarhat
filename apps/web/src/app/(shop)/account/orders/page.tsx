'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
    Search, 
    Filter, 
    ChevronRight, 
    Package, 
    Truck, 
    CheckCircle2, 
    XCircle, 
    Clock,
    RefreshCcw,
    ArrowRight,
    ShoppingBag,
    AlertCircle,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';
import { MOCK_ORDERS, OrderStatus } from '@/lib/mock-data/orders';

const STATUS_CONFIG: Record<string, { color: string, bg: string, icon: any, label: string }> = {
    pending: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, label: 'Pending' },
    processing: { color: 'text-blue-600', bg: 'bg-blue-50', icon: RefreshCcw, label: 'Processing' },
    shipped: { color: 'text-orange-600', bg: 'bg-orange-50', icon: Truck, label: 'Shipped' },
    delivered: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2, label: 'Delivered' },
    cancelled: { color: 'text-rose-600', bg: 'bg-rose-50', icon: XCircle, label: 'Cancelled' },
};

const TABS: { id: string, label: string }[] = [
    { id: 'all', label: 'All Artifacts' },
    { id: 'pending', label: 'Pending' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
];

export default function MyOrdersPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/account/orders');
        }
        setIsLoaded(true);
    }, [status, router]);

    if (status === 'loading' || !isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <RefreshCcw className="h-10 w-10 text-indigo-600" />
                </motion.div>
            </div>
        );
    }

    const filteredOrders = MOCK_ORDERS.filter(order => {
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    return (
        <div className="bg-[#fafafa] min-h-screen pb-24 font-sans">
            <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-px w-8 bg-black" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Acquisition History</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">My Manifests</h1>
                    </div>
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-black transition-colors" />
                        <input 
                            type="text" 
                            placeholder="SEARCH IDENTIFIER OR ITEM..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-12 pb-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                activeTab === tab.id 
                                    ? "bg-black text-white border-black shadow-xl shadow-black/10" 
                                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-8">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                <ShoppingBag className="h-10 w-10 text-gray-200" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">No Manifests Found</h3>
                            <p className="text-gray-400 font-medium max-w-sm mx-auto mb-10">We couldn't find any orders matching your current filter criteria.</p>
                            <Button variant="outline" onClick={() => setActiveTab('all')} className="rounded-xl px-8 h-12 text-[10px] font-black uppercase tracking-widest">
                                View All Manifests
                            </Button>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.map((order) => {
                                const status = STATUS_CONFIG[order.status];
                                const StatusIcon = status.icon;

                                return (
                                    <motion.div
                                        key={order.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="group bg-white rounded-[3rem] p-8 lg:p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 relative overflow-hidden"
                                    >
                                        {/* Status Line */}
                                        <div className="absolute top-0 left-0 w-2 h-full bg-current opacity-10" style={{ color: status.color.split('-')[1] === 'rose' ? '#f43f5e' : status.color.split('-')[1] === 'amber' ? '#f59e0b' : status.color.split('-')[1] === 'blue' ? '#3b82f6' : status.color.split('-')[1] === 'orange' ? '#f97316' : '#10b981' }} />

                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                            
                                            {/* Order Identity & Date */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl font-black text-gray-900 tracking-tighter font-mono">#{order.id}</span>
                                                    <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", status.bg, status.color)}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {status.label}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <span>{order.paymentMethod}</span>
                                                </div>
                                            </div>

                                            {/* Items Preview */}
                                            <div className="flex items-center gap-4 flex-1 lg:max-w-md">
                                                <div className="flex -space-x-4">
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <div key={item.id} className="relative w-16 aspect-[3/4] rounded-xl overflow-hidden border-2 border-white bg-gray-50 shadow-lg" style={{ zIndex: 10 - idx }}>
                                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pl-2">
                                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight line-clamp-1">{order.items[0].name}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                        {order.items.length > 1 ? `+${order.items.length - 1} OTHER ARTIFACTS` : 'SINGLE ARTIFACT'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Price & Actions */}
                                            <div className="flex items-center justify-between lg:justify-end gap-10">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Authenticated Total</p>
                                                    <p className="text-2xl font-black text-gray-900 font-mono tracking-tighter">{formatPrice(order.total)}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Link href={`/orders/${order.id}`}>
                                                        <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-gray-50 hover:bg-black hover:text-white transition-all group">
                                                            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons Layer */}
                                        <div className="mt-10 pt-8 border-t border-gray-50 flex flex-wrap items-center gap-4">
                                            <Link href={`/orders/${order.id}`} className="flex-1 min-w-[140px]">
                                                <Button variant="outline" className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-gray-100 hover:border-black transition-all">
                                                    View Manifest Details
                                                </Button>
                                            </Link>
                                            
                                            {order.status === 'shipped' && (
                                                <Link href={`/orders/${order.id}`} className="flex-1 min-w-[140px]">
                                                    <Button className="w-full h-14 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/10">
                                                        Track Logistics
                                                    </Button>
                                                </Link>
                                            )}

                                            {order.status === 'pending' && (
                                                <Button 
                                                    onClick={() => setOrderToCancel(order.id)}
                                                    variant="ghost" 
                                                    className="flex-1 min-w-[140px] h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50"
                                                >
                                                    Cancel Acquisition
                                                </Button>
                                            )}

                                            {order.status === 'delivered' && (
                                                <Button className="flex-1 min-w-[140px] h-14 rounded-2xl bg-black text-white hover:bg-gray-800 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20">
                                                    Reorder Collection
                                                </Button>
                                            )}
                                        </div>

                                        {/* Confirmation Overlay for Cancellation */}
                                        <AnimatePresence>
                                            {orderToCancel === order.id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center"
                                                >
                                                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-4 border border-rose-100">
                                                        <AlertCircle className="h-8 w-8" />
                                                    </div>
                                                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Retract Manifest?</h4>
                                                    <p className="text-gray-400 text-xs font-medium mb-8 max-w-xs">This will terminate the acquisition process for order #{order.id}. This action is permanent.</p>
                                                    <div className="flex gap-4 w-full max-w-xs">
                                                        <Button 
                                                            onClick={() => setOrderToCancel(null)}
                                                            className="flex-1 h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest"
                                                        >
                                                            Yes, Terminate
                                                        </Button>
                                                        <Button 
                                                            variant="outline"
                                                            onClick={() => setOrderToCancel(null)}
                                                            className="flex-1 h-12 rounded-xl border-gray-100 text-[10px] font-black uppercase tracking-widest"
                                                        >
                                                            No, Keep
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </main>
        </div>
    );
}
