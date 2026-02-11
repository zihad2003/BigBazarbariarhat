'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    User,
    Package,
    MapPin,
    Heart,
    Settings,
    LogOut,
    ChevronRight,
    ShoppingBag,
    Clock,
    CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

export default function AccountPage() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div></div>;

    const stats = [
        { label: 'Total Orders', value: '12', icon: Package, color: 'bg-indigo-50 text-indigo-600' },
        { label: 'Pending Orders', value: '2', icon: Clock, color: 'bg-amber-50 text-amber-600' },
        { label: 'Wishlist Items', value: '8', icon: Heart, color: 'bg-red-50 text-red-600' },
        { label: 'Saved Addresses', value: '3', icon: MapPin, color: 'bg-green-50 text-green-600' },
    ];

    const recentOrders = [
        { id: '#ORD-9283', date: 'Oct 24, 2024', status: 'Delivered', total: '৳2,450', items: 3 },
        { id: '#ORD-9122', date: 'Oct 18, 2024', status: 'Processing', total: '৳5,800', items: 1 },
        { id: '#ORD-8944', date: 'Oct 12, 2024', status: 'Shipped', total: '৳1,200', items: 2 },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-50">
                            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white text-2xl font-black">
                                {user?.firstName?.charAt(0) || user?.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-black text-xl text-gray-900">{user?.fullName || 'Valued Customer'}</h2>
                                <p className="text-sm text-gray-500 font-medium truncate max-w-[140px]">{user?.emailAddresses[0].emailAddress}</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {[
                                { label: 'Dashboard', icon: User, href: '/account', active: true },
                                { label: 'My Orders', icon: Package, href: '/account/orders' },
                                { label: 'Addresses', icon: MapPin, href: '/account/addresses' },
                                { label: 'Wishlist', icon: Heart, href: '/wishlist' },
                                { label: 'Payment Methods', icon: CreditCard, href: '/account/payments' },
                                { label: 'Settings', icon: Settings, href: '/account/settings' },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${item.active ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-bold">{item.label}</span>
                                    </div>
                                    <ChevronRight className={`h-4 w-4 ${item.active ? 'text-white' : 'text-gray-300'}`} />
                                </Link>
                            ))}
                            <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold mt-8">
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 space-y-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Welcome back, {user?.firstName || 'Friend'}!</h1>
                        <p className="text-gray-500 text-lg font-medium">From your dashboard you can view your recent orders and manage your account settings.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
                                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Recent Orders Table */}
                        <section className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black">Recent Orders</h3>
                                <Link href="/account/orders" className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
                                    View All <ChevronRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="space-y-6">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-gray-100 transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 font-black text-xs border border-gray-200 group-hover:bg-black group-hover:text-white transition-colors">
                                                #
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900">{order.id}</div>
                                                <div className="text-xs text-gray-400 font-bold">{order.date} • {order.items} Items</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-gray-900 mb-1">{order.total}</div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'Processing' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Quick Tips / Promotional */}
                        <div className="space-y-8">
                            <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                <div className="relative z-10">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                                        Loyalty Rewards
                                    </span>
                                    <h4 className="text-4xl font-black mb-4 leading-tight">You have <span className="text-amber-400">450</span> Points</h4>
                                    <p className="text-indigo-100 mb-10 font-medium text-lg">Earn more points with every purchase and redeem them for exclusive discounts.</p>
                                    <Button className="bg-white text-indigo-600 hover:bg-gray-100 rounded-2xl h-14 px-8 font-black text-lg shadow-xl shadow-black/10">
                                        Redeem Now
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-[3rem] p-10 text-white flex items-center justify-between group overflow-hidden relative">
                                <div className="relative z-10">
                                    <h4 className="text-2xl font-black mb-2">Need a Stylist?</h4>
                                    <p className="text-gray-400 font-medium mb-6">Book a free session with our experts.</p>
                                    <button className="flex items-center gap-2 font-black text-indigo-400 group-hover:gap-4 transition-all">
                                        Book Consultation <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                                <ShoppingBag className="h-20 w-20 text-white/5 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
