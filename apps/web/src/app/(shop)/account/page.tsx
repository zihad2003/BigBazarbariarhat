'use client';

import Link from 'next/link';
import {
    Package,
    MapPin,
    Heart,
    Clock,
    ChevronRight,
    ShoppingBag,
    Bell,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useSession } from 'next-auth/react';
import { MOCK_ORDERS } from '@/lib/mock-data/orders';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AccountDashboard() {
    const { data: session } = useSession();
    const user = session?.user;
    const wishlistCount = useWishlistStore(state => state.getItemCount());

    // Stats calculation from mock data
    const totalOrders = MOCK_ORDERS.length;
    const pendingOrders = MOCK_ORDERS.filter(o => o.status === 'pending').length;
    const addressCount = 1; // Default mock

    const stats = [
        { label: 'Total Manifests', value: totalOrders.toString(), icon: Package, color: 'bg-indigo-50 text-indigo-600' },
        { label: 'Awaiting Auth', value: pendingOrders.toString(), icon: Clock, color: 'bg-amber-50 text-amber-600' },
        { label: 'Gallery Items', value: wishlistCount.toString(), icon: Heart, color: 'bg-rose-50 text-rose-600' },
        { label: 'Stored Coordinates', value: addressCount.toString(), icon: MapPin, color: 'bg-emerald-50 text-emerald-600' },
    ];

    return (
        <div className="space-y-12">
            {/* Welcome Area */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-black" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Curator Dashboard</span>
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Welcome, {user?.name?.split(' ')[0] || 'Friend'}</h1>
                <p className="text-gray-400 text-lg font-medium mt-2 leading-relaxed max-w-2xl">
                    Your central command for artifact acquisition, logistics tracking, and curated galleries.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={stat.label} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl group"
                    >
                        <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                            <stat.icon className="h-7 w-7" />
                        </div>
                        <div className="text-4xl font-black text-gray-900 mb-1 font-mono tracking-tighter">{stat.value}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Recent Manifests */}
                <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black uppercase tracking-tight">Recent Manifests</h3>
                        <Link href="/account/orders" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-black transition-colors flex items-center gap-2">
                            View History <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {MOCK_ORDERS.slice(0, 3).map((order) => (
                            <Link key={order.id} href={`/orders/${order.id}`}>
                                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all group border border-transparent hover:border-gray-100 mb-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 font-black text-[10px] border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                                            #{order.id.split('-').pop()}
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 text-sm uppercase tracking-tight">{order.id}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                {new Date(order.date).toLocaleDateString()} • {order.items.length} Artifacts
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-gray-900 mb-1 font-mono">{formatPrice(order.total)}</div>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter",
                                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        )}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Quick Actions & Security */}
                <div className="space-y-8">
                    <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
                                Loyalty Protocol
                            </span>
                            <h4 className="text-4xl font-black mb-4 tracking-tighter uppercase leading-none">Curator Level: <span className="text-amber-400">SILVER</span></h4>
                            <p className="text-indigo-100 mb-10 font-medium text-lg max-w-sm leading-relaxed">You are 2 acquisitions away from Gold Tier status and complimentary global transit.</p>
                            <Button className="bg-white text-indigo-600 hover:bg-gray-100 rounded-[1.5rem] h-16 px-10 font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10">
                                View Rewards Matrix
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Link href="/account/notifications" className="bg-white rounded-[2.5rem] p-8 border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-gray-100 transition-all">
                                    <Bell className="h-6 w-6" />
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Signals</h5>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">2 New Messages</p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-black transition-all" />
                        </Link>
                        <Link href="/account/settings" className="bg-white rounded-[2.5rem] p-8 border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-gray-100 transition-all">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Instruments</h5>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Payment Security</p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-200 group-hover:text-black transition-all" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
