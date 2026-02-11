'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Printer,
    Truck,
    Package,
    CheckCircle2,
    Clock,
    XCircle,
    ShoppingBag,
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    ChevronRight,
    Loader2,
    AlertCircle,
    Calendar,
    ExternalLink,
    MessageSquare,
    Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const formatDate = (date: string | Date, includeTime = true) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: includeTime ? '2-digit' : undefined,
        minute: includeTime ? '2-digit' : undefined,
    }).format(d);
};

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${params.id}`);
                const result = await res.json();
                if (result.success) {
                    setOrder(result.data);
                    setStatus(result.data.status);
                    setPaymentStatus(result.data.paymentStatus);
                    setAdminNotes(result.data.adminNotes || '');
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [params.id]);

    const handleUpdateOrder = async () => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/orders/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    paymentStatus,
                    adminNotes
                })
            });
            const result = await res.json();
            if (result.success) {
                setOrder(result.data);
                // toast.success('Manifest updated successfully');
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="h-16 w-16 animate-spin text-indigo-600" />
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs text-center">Interrogating Logistics Ledger...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="h-20 w-20 text-rose-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Order Vanished</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-3">The requested transaction manifest could not be found.</p>
                <Button onClick={() => router.back()} className="mt-8">Return to Inventory</Button>
            </div>
        );
    }

    const getStatusConfig = (s: string) => {
        switch (s) {
            case 'PENDING': return { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock, label: 'Awaiting Authorization' };
            case 'CONFIRMED': return { color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: CheckCircle2, label: 'Confirmed' };
            case 'PROCESSING': return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Package, label: 'In Preparation' };
            case 'SHIPPED': return { color: 'text-violet-600 bg-violet-50 border-violet-100', icon: Truck, label: 'In Transit' };
            case 'DELIVERED': return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: ShoppingBag, label: 'Transferred' };
            case 'CANCELLED': return { color: 'text-rose-600 bg-rose-50 border-rose-100', icon: XCircle, label: 'Terminated' };
            default: return { color: 'text-gray-600 bg-gray-50 border-gray-100', icon: Clock, label: s };
        }
    };

    const statusConfig = getStatusConfig(order.status);

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Master Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-gray-100 pb-12">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => router.back()}
                        className="w-16 h-16 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm group"
                    >
                        <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">#{order.orderNumber}</h1>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusConfig.color}`}>
                                {statusConfig.label}
                            </span>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                            Initiated on {formatDate(order.createdAt)}
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            Global Ledger ID: {order.id}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="h-16 px-8 border-2 rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-sm">
                        <Printer className="h-5 w-5" />
                        Print Manifest
                    </Button>
                    <Button
                        onClick={handleUpdateOrder}
                        disabled={updating}
                        className="h-16 px-12 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Authorize Fulfillment
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Fulfillment Controls & Summary */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Catalog Manifest (Items) */}
                    <section className="bg-white rounded-[4rem] border border-gray-100 overflow-hidden shadow-2xl shadow-indigo-900/5">
                        <div className="p-12 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-4">
                                <ShoppingBag className="h-6 w-6 text-indigo-600" />
                                Catalog Items
                                <span className="ml-2 px-3 py-1 bg-white text-gray-400 rounded-xl text-xs border border-gray-100 font-black">{order.items.length}</span>
                            </h3>
                            <Link href={`/products`} className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                                Inventory Master <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="p-10 flex items-center gap-8 hover:bg-gray-50/50 transition-colors group">
                                    <div className="w-24 h-24 bg-gray-100 rounded-[2rem] overflow-hidden border border-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                        {item.product.images?.[0] ? (
                                            <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                                        ) : <div className="w-full h-full flex items-center justify-center text-gray-300 font-black">NA</div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xl font-black text-gray-900 truncate tracking-tight">{item.productName}</h4>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">SKU: {item.sku}</p>
                                            {item.variantName && (
                                                <>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{item.variantName}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-gray-900">৳{Number(item.totalPrice).toLocaleString()}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                            {item.quantity} × ৳{Number(item.unitPrice).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Summary Block */}
                        <div className="p-12 bg-black text-white space-y-6">
                            <div className="flex justify-between text-indigo-300/60 font-black uppercase tracking-[0.2em] text-[10px]">
                                <span>Sub-Total Manifest</span>
                                <span>৳{Number(order.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-emerald-400/60 font-black uppercase tracking-[0.2em] text-[10px]">
                                <span>Promotion Applied</span>
                                <span>- ৳{Number(order.discountAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-indigo-300/60 font-black uppercase tracking-[0.2em] text-[10px]">
                                <span>Logistics Overhead</span>
                                <span>+ ৳{Number(order.shippingCost).toLocaleString()}</span>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 italic">Authorized Total</p>
                                    <h3 className="text-4xl font-black tracking-tighter italic">৳{Number(order.totalAmount).toLocaleString()}</h3>
                                </div>
                                <div className="text-right">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 ${order.paymentStatus === 'PAID' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                                        Payment: {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Timeline / Fulfillment Steps */}
                    <section className="bg-white rounded-[4rem] border border-gray-100 p-12 shadow-sm">
                        <h3 className="text-2xl font-black text-gray-900 mb-12 uppercase tracking-tight flex items-center gap-4">
                            <Clock className="h-6 w-6 text-indigo-600" />
                            Fulfillment Journey
                        </h3>
                        <div className="space-y-12 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-1 before:bg-gray-50 before:rounded-full">
                            {[
                                { status: 'DELIVERED', icon: ShoppingBag, label: 'Transferred to Customer', time: order.deliveredAt },
                                { status: 'SHIPPED', icon: Truck, label: 'Handed to Carrier', time: order.status === 'SHIPPED' ? order.updatedAt : null },
                                { status: 'PROCESSING', icon: Package, label: 'In Curation Hub', time: order.status === 'PROCESSING' ? order.updatedAt : null },
                                { status: 'CONFIRMED', icon: CheckCircle2, label: 'Inventory Authorized', time: order.status === 'CONFIRMED' ? order.updatedAt : null },
                                { status: 'PENDING', icon: Clock, label: 'Order Registered', time: order.createdAt },
                            ].map((step, idx) => (
                                <div key={idx} className={`relative pl-24 transition-opacity ${!step.time ? 'opacity-30 grayscale' : 'opacity-100'}`}>
                                    <div className={`absolute left-0 w-16 h-16 rounded-3xl flex items-center justify-center transition-all shadow-xl ${step.time ? 'bg-black text-white' : 'bg-gray-50 text-gray-300'}`}>
                                        <step.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900 tracking-tight">{step.label}</h4>
                                        {step.time && (
                                            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-1">
                                                {formatDate(step.time)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Account & Logistics Context */}
                <div className="space-y-12">
                    {/* Entity Information (Customer) */}
                    <section className="bg-white rounded-[4rem] border border-gray-100 p-12 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-[10rem] opacity-30 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-black text-gray-900 mb-10 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                            <User className="h-5 w-5 text-indigo-600" />
                            Entity Profile
                        </h3>
                        {order.user ? (
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-indigo-100 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                                        {order.user.avatar ? <img src={order.user.avatar} alt="" /> : <div className="w-full h-full flex items-center justify-center text-indigo-600 font-black text-xl">{order.user.firstName?.[0] || 'U'}</div>}
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic">{order.user.firstName} {order.user.lastName}</h4>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">Registered</span>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-4 text-gray-400 group/item">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{order.user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400 group/item">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{order.guestPhone || 'No Phone Sync'}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-amber-100 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-xl">
                                        <User className="h-10 w-10 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic">{order.guestName || 'Guest Associate'}</h4>
                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">Unregistered</span>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <Mail className="h-5 w-5" />
                                        <span className="text-sm font-bold text-gray-900">{order.guestEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <Phone className="h-5 w-5" />
                                        <span className="text-sm font-bold text-gray-900">{order.guestPhone}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Logistics Coordinates (Shipping) */}
                    <section className="bg-white rounded-[4rem] border border-gray-100 p-12 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 mb-10 border-b border-gray-50 pb-6 uppercase tracking-widest flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-rose-500" />
                            Logistics Destination
                        </h3>
                        <div className="space-y-6">
                            <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-50">
                                <p className="text-base font-black text-gray-900 leading-relaxed italic">
                                    {order.shippingAddress ? (
                                        <>
                                            {order.shippingAddress.addressLine1},<br />
                                            {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2},<br /></>}
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode},<br />
                                            {order.shippingAddress.country}
                                        </>
                                    ) : order.shippingAddressId ? (
                                        <span className="text-rose-400">Address Node Link Broken (ID: {order.shippingAddressId})</span>
                                    ) : order.guestAddress ? (
                                        <>
                                            {typeof order.guestAddress === 'string' ? order.guestAddress : (
                                                <>
                                                    {(order.guestAddress as any).addressLine1 || (order.guestAddress as any).address},<br />
                                                    {(order.guestAddress as any).city}, {(order.guestAddress as any).postalCode}<br />
                                                    {(order.guestAddress as any).country || 'Bangladesh'}
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-gray-400">Coordinates Not Sync'd</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl shadow-indigo-500/20">
                                <Truck className="h-10 w-10 opacity-50" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Carrier Method</p>
                                    <h4 className="text-xl font-black tracking-tighter italic">{order.shippingMethod || 'Standard Courier'}</h4>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Operational Directives (Admin Section) */}
                    <section className="bg-black rounded-[4rem] p-12 text-white shadow-2xl shadow-black/40">
                        <h3 className="text-xl font-black mb-10 border-b border-white/10 pb-6 uppercase tracking-widest flex items-center gap-3 text-indigo-400">
                            <AlertCircle className="h-5 w-5" />
                            Fulfillment Directives
                        </h3>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Manifest Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl font-black text-indigo-400 focus:bg-white/10 transition-all outline-none appearance-none"
                                >
                                    <option value="PENDING">Awaiting Authorization</option>
                                    <option value="CONFIRMED">Inventory Authorized</option>
                                    <option value="PROCESSING">In Preparation Hub</option>
                                    <option value="SHIPPED">Handed to Carrier</option>
                                    <option value="DELIVERED">Customer Verified Transfer</option>
                                    <option value="CANCELLED">Manifest Terminated</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Financial Clearance</label>
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl font-black text-emerald-400 focus:bg-white/10 transition-all outline-none appearance-none"
                                >
                                    <option value="PENDING">Payment Latent</option>
                                    <option value="PAID">Capital Verified</option>
                                    <option value="FAILED">Transaction Ruptured</option>
                                    <option value="REFUNDED">Capital Reversed</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Internal Intelligence (Admin Notes)</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={4}
                                    className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl font-medium text-white focus:bg-white/10 transition-all outline-none resize-none"
                                    placeholder="Enter internal intelligence regarding this fulfillment..."
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
