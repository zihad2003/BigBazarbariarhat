'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
    Search, 
    ChevronRight, 
    Package, 
    Truck, 
    CheckCircle2, 
    XCircle, 
    Clock,
    RefreshCcw,
    ShoppingBag,
    AlertCircle,
    Printer
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';
import { MOCK_ORDERS } from '@/lib/mock-data/orders';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/lib/stores/ui-store';

const STATUS_CONFIG: Record<string, { color: string, bg: string, icon: any, label: string }> = {
    pending: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, label: 'Pending' },
    processing: { color: 'text-blue-600', bg: 'bg-blue-50', icon: RefreshCcw, label: 'Processing' },
    shipped: { color: 'text-orange-600', bg: 'bg-orange-50', icon: Truck, label: 'Shipped' },
    delivered: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2, label: 'Delivered' },
    cancelled: { color: 'text-rose-600', bg: 'bg-rose-50', icon: XCircle, label: 'Cancelled' },
};

const TABS = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
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
    const { addItem: addToCart } = useCartStore();
    const { openCart, addNotification } = useUIStore();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/account/orders');
        }
        setIsLoaded(true);
    }, [status, router]);

    if (status === 'loading' || !isLoaded) {
        return (
            <div className="h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
            </div>
        );
    }

    const filteredOrders = MOCK_ORDERS.filter(order => {
        const matchesTab = activeTab === 'all' || order.status === activeTab;
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    const handleReorder = (order: typeof MOCK_ORDERS[0]) => {
        order.items.forEach(item => {
            addToCart({
                productId: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                stock: 99,
            });
        });
        addNotification({ type: 'success', message: `${order.items.length} item(s) added to cart from order #${order.id}` });
        openCart();
    };

    const handleInvoice = (orderId: string) => {
        const order = MOCK_ORDERS.find(o => o.id === orderId);
        if (!order) return;

        const invoiceWindow = window.open('', '_blank', 'width=800,height=900');
        if (!invoiceWindow) {
            addNotification({ type: 'error', message: 'Please allow pop-ups to print invoices.' });
            return;
        }

        const itemsHTML = order.items.map(item => `
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">${item.name}</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;">${item.quantity}</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;">৳ ${item.price.toLocaleString()}</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:700;">৳ ${(item.price * item.quantity).toLocaleString()}</td>
            </tr>
        `).join('');

        const addr = order.shippingAddress;

        invoiceWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${order.id} — Big Bazar Bariarhat</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: -apple-system, 'Segoe UI', 'Inter', sans-serif; color: #171717; padding: 40px; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid #171717; }
                    .brand { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase; }
                    .brand-sub { font-size: 10px; color: #a3a3a3; font-weight: 500; margin-top: 4px; letter-spacing: 2px; text-transform: uppercase; }
                    .invoice-label { font-size: 28px; font-weight: 900; text-align: right; letter-spacing: -1px; text-transform: uppercase; }
                    .invoice-id { font-size: 11px; color: #a3a3a3; font-weight: 600; text-align: right; margin-top: 4px; }
                    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
                    .meta-block h4 { font-size: 9px; font-weight: 700; color: #a3a3a3; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
                    .meta-block p { font-size: 13px; line-height: 1.6; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                    th { font-size: 9px; font-weight: 700; color: #a3a3a3; text-transform: uppercase; letter-spacing: 1.5px; padding: 8px 0; border-bottom: 2px solid #171717; text-align: left; }
                    th:nth-child(2) { text-align: center; }
                    th:nth-child(3), th:nth-child(4) { text-align: right; }
                    .totals { margin-left: auto; width: 260px; }
                    .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
                    .totals .row.total { font-weight: 900; font-size: 18px; border-top: 2px solid #171717; padding-top: 12px; margin-top: 8px; }
                    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 10px; color: #a3a3a3; }
                    @media print { body { padding: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="brand">Big Bazar</div>
                        <div class="brand-sub">Bariarhat • Since 2024</div>
                    </div>
                    <div>
                        <div class="invoice-label">Invoice</div>
                        <div class="invoice-id">#${order.id} • ${new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                </div>

                <div class="meta-grid">
                    <div class="meta-block">
                        <h4>Ship To</h4>
                        <p>
                            <strong>${addr.fullName}</strong><br/>
                            ${addr.address}<br/>
                            ${addr.upazila}, ${addr.district}<br/>
                            ${addr.division}<br/>
                            Phone: ${addr.phone}
                        </p>
                    </div>
                    <div class="meta-block" style="text-align:right;">
                        <h4>Payment Method</h4>
                        <p>${order.paymentMethod}</p>
                        <h4 style="margin-top:16px;">Status</h4>
                        <p style="text-transform:capitalize;">${order.status}</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>

                <div class="totals">
                    <div class="row"><span>Subtotal</span><span>৳ ${order.subtotal.toLocaleString()}</span></div>
                    <div class="row"><span>Shipping</span><span>${order.shippingCost === 0 ? 'Free' : '৳ ' + order.shippingCost.toLocaleString()}</span></div>
                    ${order.discount > 0 ? `<div class="row"><span>Discount</span><span style="color:#dc2626;">-৳ ${order.discount.toLocaleString()}</span></div>` : ''}
                    <div class="row total"><span>Total</span><span>৳ ${order.total.toLocaleString()}</span></div>
                </div>

                <div class="footer">
                    Thank you for shopping with Big Bazar Bariarhat.<br/>
                    For questions, contact us at support@bigbazar.com
                </div>
            </body>
            </html>
        `);

        invoiceWindow.document.close();
        invoiceWindow.focus();
        setTimeout(() => invoiceWindow.print(), 300);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">My Orders</h1>
                <p className="text-neutral-400 text-sm font-medium mt-1">View and manage your order history.</p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                                activeTab === tab.id 
                                    ? "bg-neutral-900 text-white border-neutral-900" 
                                    : "bg-white text-neutral-400 border-neutral-100 hover:border-neutral-200"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-72 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
                    <input 
                        type="text" 
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="bg-neutral-50 rounded-xl p-16 text-center border border-neutral-100">
                        <ShoppingBag className="h-10 w-10 text-neutral-200 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight mb-2">No Orders Found</h3>
                        <p className="text-neutral-400 text-sm font-medium max-w-xs mx-auto mb-6">No orders match your current filters.</p>
                        <Button variant="outline" onClick={() => setActiveTab('all')} className="rounded-xl px-6 h-9 text-[10px] font-bold uppercase tracking-widest border-neutral-200">
                            View All Orders
                        </Button>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredOrders.map((order) => {
                            const statusCfg = STATUS_CONFIG[order.status];
                            const StatusIcon = statusCfg.icon;

                            return (
                                <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="group bg-neutral-50 rounded-xl p-5 border border-neutral-100 hover:bg-white hover:border-neutral-200 transition-all relative overflow-hidden"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="flex -space-x-3 shrink-0">
                                                {order.items.slice(0, 2).map((item, idx) => (
                                                    <div key={item.id} className="relative w-12 h-14 rounded-lg overflow-hidden border-2 border-white bg-neutral-100" style={{ zIndex: 10 - idx }}>
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className="text-sm font-black text-neutral-900 tracking-tight">#{order.id}</span>
                                                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest", statusCfg.bg, statusCfg.color)}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusCfg.label}
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-neutral-400 font-medium mt-1">
                                                    {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} · {order.paymentMethod}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price & Actions */}
                                        <div className="flex items-center gap-4 lg:gap-6">
                                            <div className="text-right">
                                                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Total Amount</p>
                                                <p className="text-lg font-black text-neutral-900 tracking-tight">{formatPrice(order.total)}</p>
                                            </div>
                                            <Link href={`/orders/${order.id}`}>
                                                <Button variant="ghost" className="h-10 w-10 rounded-xl bg-white border border-neutral-100 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all p-0">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-3">
                                        <Link href={`/orders/${order.id}`} className="flex-1 min-w-[120px]">
                                            <Button variant="outline" className="w-full h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest border-neutral-100 hover:border-neutral-900 transition-all">
                                                View Details
                                            </Button>
                                        </Link>
                                        
                                        <Button 
                                            variant="outline" 
                                            onClick={() => handleInvoice(order.id)}
                                            className="h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest border-neutral-100 hover:border-neutral-900 gap-2"
                                        >
                                            <Printer className="h-3 w-3" /> Invoice
                                        </Button>

                                        {order.status === 'shipped' && (
                                            <Link href={`/orders/${order.id}`} className="flex-1 min-w-[120px]">
                                                <Button className="w-full h-9 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold uppercase tracking-widest">
                                                    Track Order
                                                </Button>
                                            </Link>
                                        )}

                                        {order.status === 'pending' && (
                                            <Button 
                                                onClick={() => setOrderToCancel(order.id)}
                                                variant="ghost" 
                                                className="h-9 rounded-xl text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-50"
                                            >
                                                Cancel Order
                                            </Button>
                                        )}

                                        {order.status === 'delivered' && (
                                            <Button 
                                                onClick={() => handleReorder(order)}
                                                className="flex-1 min-w-[120px] h-9 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-widest"
                                            >
                                                Reorder
                                            </Button>
                                        )}
                                    </div>

                                    {/* Cancel Confirmation Overlay */}
                                    <AnimatePresence>
                                        {orderToCancel === order.id && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center rounded-xl"
                                            >
                                                <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
                                                <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight mb-1">Cancel Order?</h4>
                                                <p className="text-neutral-400 text-xs font-medium mb-4 max-w-xs">This will cancel order #{order.id}. This action is permanent.</p>
                                                <div className="flex gap-3">
                                                    <Button 
                                                        onClick={() => setOrderToCancel(null)}
                                                        className="h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest px-6"
                                                    >
                                                        Yes, Cancel
                                                    </Button>
                                                    <Button 
                                                        variant="outline"
                                                        onClick={() => setOrderToCancel(null)}
                                                        className="h-9 rounded-xl border-neutral-200 text-[10px] font-bold uppercase tracking-widest px-6"
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
        </div>
    );
}
