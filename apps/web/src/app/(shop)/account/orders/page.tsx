'use client';

import {
    Package,
    ChevronRight,
    Search,
    Filter,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
    const orders = [
        { id: '#ORD-9283', date: 'Oct 24, 2024', status: 'Delivered', total: '৳2,450', items: 3, tracking: 'BB-9283-DX' },
        { id: '#ORD-9122', date: 'Oct 18, 2024', status: 'Processing', total: '৳5,800', items: 1, tracking: 'BB-9122-PX' },
        { id: '#ORD-8944', date: 'Oct 12, 2024', status: 'Shipped', total: '৳1,200', items: 2, tracking: 'BB-8944-SX' },
        { id: '#ORD-8811', date: 'Oct 05, 2024', status: 'Delivered', total: '৳3,100', items: 4, tracking: 'BB-8811-DX' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-4 uppercase tracking-widest">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Order History</h1>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:w-64 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Find an order..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-base focus:outline-none focus:bg-white focus:border-gray-200 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="hidden md:grid grid-cols-6 gap-4 p-8 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                    <div className="col-span-1">Order #</div>
                    <div className="col-span-1">Date</div>
                    <div className="col-span-1">Items</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Total</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {orders.map((order) => (
                        <div key={order.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-8 items-center hover:bg-gray-50 transition-colors group">
                            <div className="col-span-1">
                                <span className="font-black text-gray-900">{order.id}</span>
                                <div className="md:hidden text-xs text-gray-400 font-bold mt-1">{order.date}</div>
                            </div>
                            <div className="col-span-1 hidden md:block">
                                <span className="font-bold text-gray-600">{order.date}</span>
                            </div>
                            <div className="col-span-1 hidden md:block">
                                <span className="font-bold text-gray-900">{order.items} Products</span>
                            </div>
                            <div className="col-span-1">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                        order.status === 'Processing' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="col-span-1">
                                <span className="font-black text-lg text-gray-900">{order.total}</span>
                            </div>
                            <div className="col-span-1 text-right">
                                <Button variant="ghost" className="rounded-xl font-bold gap-2 hover:bg-black hover:text-white transition-all">
                                    Details
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {orders.length === 0 && (
                <div className="text-center py-40 bg-gray-50 rounded-[4rem]">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                        <Package className="h-10 w-10 text-gray-200" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">No Orders Yet</h2>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg font-medium">
                        You haven't placed any orders yet. Start shopping to see your history here!
                    </p>
                    <Link href="/shop">
                        <Button className="bg-black text-white hover:bg-gray-800 rounded-2xl px-12 h-16 text-lg font-bold shadow-xl shadow-black/10">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
