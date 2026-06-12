'use client';

import Link from 'next/link';
import {
    Package,
    MapPin,
    Heart,
    Clock,
    ChevronRight,
    Bell,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSession } from 'next-auth/react';
import { MOCK_ORDERS } from '@/lib/mock-data/orders';
import { formatPrice, cn } from '@/lib/utils';

export default function AccountDashboard() {
    const { data: session } = useSession();
    const user = session?.user;
    const wishlistCount = useWishlistStore(state => state.getItemCount());

    const totalOrders = MOCK_ORDERS.length;
    const pendingOrders = MOCK_ORDERS.filter(o => o.status === 'pending').length;
    const addressCount = 1;

    const stats = [
        { label: 'Total Orders', value: totalOrders.toString(), icon: Package, color: 'text-neutral-600' },
        { label: 'Pending Orders', value: pendingOrders.toString(), icon: Clock, color: 'text-amber-600' },
        { label: 'Wishlist Items', value: wishlistCount.toString(), icon: Heart, color: 'text-rose-500' },
        { label: 'Saved Addresses', value: addressCount.toString(), icon: MapPin, color: 'text-emerald-600' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">
                    Welcome, {user?.name?.split(' ')[0] || 'Friend'}
                </h1>
                <p className="text-neutral-400 text-sm font-medium mt-1">
                    Manage your profile, track your orders, and update your shipping addresses.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-neutral-50 p-5 rounded-xl border border-neutral-100 transition-colors hover:bg-white"
                    >
                        <div className={cn("mb-3", stat.color)}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-black text-neutral-900 tracking-tight">{stat.value}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <section className="bg-neutral-50 rounded-xl border border-neutral-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black uppercase tracking-tight text-neutral-900">Recent Orders</h3>
                        <Link href="/account/orders" className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-900 transition-colors flex items-center gap-1">
                            View All <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {MOCK_ORDERS.slice(0, 3).map((order) => (
                            <Link key={order.id} href={`/orders/${order.id}`}>
                                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100 hover:border-neutral-200 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400 text-[9px] font-black border border-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                            #{order.id.split('-').pop()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-neutral-900 text-xs uppercase tracking-tight">{order.id}</div>
                                            <div className="text-[10px] text-neutral-400 font-medium mt-0.5">
                                                {new Date(order.date).toLocaleDateString()} · {order.items.length} Items
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-neutral-900 text-sm">{formatPrice(order.total)}</div>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-widest",
                                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                                            order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                                            'bg-amber-50 text-amber-600'
                                        )}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Loyalty + Quick Actions */}
                <div className="space-y-4">
                    <div className="bg-neutral-900 rounded-xl p-6 text-white">
                        <span className="px-2 py-1 bg-white/10 rounded-lg text-[8px] font-bold uppercase tracking-widest mb-4 inline-block">
                            Loyalty Program
                        </span>
                        <h4 className="text-xl font-black mb-2 tracking-tight uppercase leading-tight">
                            Membership: <span className="text-amber-400">SILVER</span>
                        </h4>
                        <p className="text-neutral-400 text-sm font-medium mb-6 leading-relaxed">
                            You are 2 orders away from Gold Tier and free shipping rewards.
                        </p>
                        <Button className="bg-white text-neutral-900 hover:bg-neutral-100 rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest">
                            View Rewards
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/account/notifications" className="bg-neutral-50 rounded-xl p-5 border border-neutral-100 flex items-center justify-between group hover:bg-white transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-neutral-900 transition-colors border border-neutral-100">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Notifications</h5>
                                    <p className="text-[9px] text-neutral-400 font-medium">2 New Messages</p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-neutral-200 group-hover:text-neutral-900 transition-colors" />
                        </Link>
                        <Link href="/account/settings" className="bg-neutral-50 rounded-xl p-5 border border-neutral-100 flex items-center justify-between group hover:bg-white transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-neutral-900 transition-colors border border-neutral-100">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Payment Methods</h5>
                                    <p className="text-[9px] text-neutral-400 font-medium">Manage payments</p>
                                </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-neutral-200 group-hover:text-neutral-900 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
