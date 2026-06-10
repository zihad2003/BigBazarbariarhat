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
    Save,
    Check
} from 'lucide-react';

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
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleQuickStatusTransition = async (nextStatus: string, nextPaymentStatus?: string) => {
        setUpdating(true);
        try {
            const bodyPayload: any = {
                status: nextStatus,
                adminNotes
            };
            if (nextPaymentStatus) {
                bodyPayload.paymentStatus = nextPaymentStatus;
            }
            const res = await fetch(`/api/orders/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPayload)
            });
            const result = await res.json();
            if (result.success) {
                setOrder(result.data);
                setStatus(result.data.status);
                if (nextPaymentStatus) {
                    setPaymentStatus(nextPaymentStatus);
                }
            }
        } catch (error) {
            console.error('Quick status update failed:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[13px] text-muted-foreground">Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-10 h-10 text-destructive" />
                <h2 className="text-lg font-semibold">Order Not Found</h2>
                <button onClick={() => router.back()} className="text-primary text-[13px] font-medium hover:underline">
                    Back to Orders
                </button>
            </div>
        );
    }

    const getStatusStyle = (s: string) => {
        switch (s) {
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'CONFIRMED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'PROCESSING': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'SHIPPED': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-semibold text-foreground">Order #{order.orderNumber}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusStyle(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-[13px] text-muted-foreground mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 border border-border rounded-lg text-[13px] font-medium hover:bg-muted/60 transition flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        Print Invoice
                    </button>
                    <button
                        onClick={handleUpdateOrder}
                        disabled={updating}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                    >
                        {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Items & Notes */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="p-5 border-b border-border bg-muted/20">
                            <h2 className="text-sm font-semibold flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-primary" />
                                Order Items
                            </h2>
                        </div>
                        <div className="divide-y divide-border">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="p-5 flex items-center gap-4 group">
                                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden border border-border flex-shrink-0">
                                        {item.product.images?.[0] ? (
                                            <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                                        ) : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">No image</div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-semibold text-foreground truncate">{item.productName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[11px] text-muted-foreground font-mono">SKU: {item.sku}</span>
                                            {item.variantName && (
                                                <span className="text-[11px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground font-medium">{item.variantName}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[14px] font-bold text-foreground">৳{Number(item.totalPrice).toLocaleString()}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {item.quantity} × ৳{Number(item.unitPrice).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Summary */}
                        <div className="p-5 bg-muted/10 border-t border-border space-y-3">
                            <div className="flex justify-between text-[13px] text-muted-foreground">
                                <span>Subtotal</span>
                                <span>৳{Number(order.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[13px] text-muted-foreground">
                                <span>Discount</span>
                                <span className="text-emerald-600">- ৳{Number(order.discountAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[13px] text-muted-foreground">
                                <span>Shipping</span>
                                <span>+ ৳{Number(order.shippingCost).toLocaleString()}</span>
                            </div>
                            <div className="pt-3 border-t border-border flex justify-between items-center">
                                <span className="text-[14px] font-bold text-foreground">Total</span>
                                <span className="text-[18px] font-bold text-primary">৳{Number(order.totalAmount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            Internal Notes
                        </h2>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add a note for internal reference..."
                            className="w-full p-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition resize-none h-24"
                        />
                    </div>
                </div>

                {/* Right Column: Order Actions & Customer Info */}
                <div className="space-y-6">
                    {/* Order Management */}
                    <div className="bg-primary text-primary-foreground rounded-xl p-6 shadow-lg shadow-primary/20">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Manage Order
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-primary-foreground/80 uppercase tracking-wider">Order Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-[13px] font-medium outline-none focus:bg-white/20"
                                >
                                    <option value="PENDING" className="text-black">Pending</option>
                                    <option value="PROCESSING" className="text-black">Processing</option>
                                    <option value="SHIPPED" className="text-black">Shipped</option>
                                    <option value="DELIVERED" className="text-black">Delivered</option>
                                    <option value="CANCELLED" className="text-black">Cancelled</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-primary-foreground/80 uppercase tracking-wider">Payment Status</label>
                                <select
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-lg text-[13px] font-medium outline-none focus:bg-white/20"
                                >
                                    <option value="PENDING" className="text-black">Unpaid</option>
                                    <option value="PAID" className="text-black">Paid</option>
                                    <option value="REFUNDED" className="text-black">Refunded</option>
                                </select>
                            </div>
                            
                            {/* Quick Actions workflow */}
                            <div className="pt-4 border-t border-white/10 space-y-2">
                                <label className="text-[11px] font-semibold text-primary-foreground/80 uppercase tracking-wider block">Quick Actions</label>
                                {order.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleQuickStatusTransition('PROCESSING')}
                                        disabled={updating}
                                        className="w-full py-2 bg-white text-primary rounded-lg text-[13px] font-bold hover:bg-white/90 transition flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Confirm Order
                                    </button>
                                )}
                                {order.status === 'PROCESSING' && (
                                    <button
                                        onClick={() => handleQuickStatusTransition('SHIPPED')}
                                        disabled={updating}
                                        className="w-full py-2 bg-white text-primary rounded-lg text-[13px] font-bold hover:bg-white/90 transition flex items-center justify-center gap-2"
                                    >
                                        <Truck className="w-4 h-4" />
                                        Mark Shipped
                                    </button>
                                )}
                                {order.status === 'SHIPPED' && (
                                    <button
                                        onClick={() => handleQuickStatusTransition('DELIVERED', 'PAID')}
                                        disabled={updating}
                                        className="w-full py-2 bg-white text-primary rounded-lg text-[13px] font-bold hover:bg-white/90 transition flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Mark Delivered (COD Paid)
                                    </button>
                                )}
                                {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                                    <button
                                        onClick={() => handleQuickStatusTransition('CANCELLED')}
                                        disabled={updating}
                                        className="w-full py-2 bg-rose-600 text-white rounded-lg text-[13px] font-bold hover:bg-rose-700 transition flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Cancel Order
                                    </button>
                                )}
                                {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                                    <p className="text-[12px] text-primary-foreground/60 italic text-center">No further transitions available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Customer Details
                        </h2>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                                {order.user?.firstName?.[0] || order.guestName?.[0] || 'C'}
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-foreground">{order.user?.firstName || order.guestName || 'Customer'}</h3>
                                <p className="text-[12px] text-muted-foreground">{order.user ? 'Registered' : 'Guest'}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                <span className="text-[13px]">{order.user?.email || order.guestEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span className="text-[13px]">{order.guestPhone}</span>
                            </div>
                        </div>

                        {order.customerStats && (
                            <div className="mt-6 pt-6 border-t border-border space-y-4">
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Customer Trust Score</h4>
                                <div className="p-3 bg-muted/40 border border-border rounded-lg space-y-2">
                                    <div className="flex justify-between items-center text-[12px]">
                                        <span className="text-muted-foreground">Rating Tier:</span>
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                                            order.customerStats.trustTierColor === 'green' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20' :
                                            order.customerStats.trustTierColor === 'yellow' ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20' :
                                            order.customerStats.trustTierColor === 'red' ? 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20' :
                                            'bg-muted text-muted-foreground'
                                        }`}>
                                            {order.customerStats.trustTier}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[12px]">
                                        <span className="text-muted-foreground">Total Orders Placed:</span>
                                        <span className="font-semibold">{order.customerStats.totalOrders}</span>
                                    </div>
                                    <div className="flex justify-between text-[12px]">
                                        <span className="text-muted-foreground">Delivered / Cancelled:</span>
                                        <span className="font-semibold text-emerald-600">
                                            {order.customerStats.deliveredOrders} <span className="text-muted-foreground">/</span> <span className="text-rose-600">{order.customerStats.cancelledOrders}</span>
                                        </span>
                                    </div>
                                    {order.customerStats.totalOrders >= 2 && (
                                        <div className="flex justify-between text-[12px]">
                                            <span className="text-muted-foreground">Delivery Success Rate:</span>
                                            <span className={`font-bold ${
                                                order.customerStats.deliveryRate >= 80 ? 'text-emerald-600' :
                                                order.customerStats.deliveryRate >= 50 ? 'text-amber-600' :
                                                'text-rose-600'
                                            }`}>
                                                {order.customerStats.deliveryRate}%
                                            </span>
                                        </div>
                                    )}

                                    {order.customerStats.deliveryPartnerStats && (
                                        <div className="pt-4 mt-4 border-t border-border/60 space-y-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Courier Stats (Bangladesh)</h5>
                                                {order.customerStats.deliveryPartnerStats.isMock && (
                                                    <span className="text-[9px] font-bold text-amber-600 px-1 py-0.2 bg-amber-50 rounded border border-amber-100">Sandbox</span>
                                                )}
                                            </div>
                                            
                                            <div className="flex justify-between items-center text-[12px]">
                                                <span className="text-muted-foreground">Courier Trust:</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                    order.customerStats.deliveryPartnerStats.trustTierColor === 'green' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20' :
                                                    order.customerStats.deliveryPartnerStats.trustTierColor === 'yellow' ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20' :
                                                    order.customerStats.deliveryPartnerStats.trustTierColor === 'red' ? 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20' :
                                                    'bg-muted text-muted-foreground'
                                                }`}>
                                                    {order.customerStats.deliveryPartnerStats.trustTier}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-[12px]">
                                                <span className="text-muted-foreground">Total Parcels:</span>
                                                <span className="font-semibold">{order.customerStats.deliveryPartnerStats.totalOrders}</span>
                                            </div>

                                            <div className="flex justify-between text-[12px]">
                                                <span className="text-muted-foreground">Delivered / Returned:</span>
                                                <span className="font-semibold text-emerald-600">
                                                    {order.customerStats.deliveryPartnerStats.deliveredOrders} <span className="text-muted-foreground">/</span> <span className="text-rose-600">{order.customerStats.deliveryPartnerStats.cancelledOrders}</span>
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-[12px]">
                                                <span className="text-muted-foreground">Success Rate:</span>
                                                <span className={`font-bold ${
                                                    order.customerStats.deliveryPartnerStats.deliveryRate >= 80 ? 'text-emerald-600' :
                                                    order.customerStats.deliveryPartnerStats.deliveryRate >= 50 ? 'text-amber-600' :
                                                    'text-rose-600'
                                                }`}>
                                                    {order.customerStats.deliveryPartnerStats.deliveryRate}%
                                                </span>
                                            </div>

                                            {order.customerStats.deliveryPartnerStats.fraudReports > 0 && (
                                                <div className="flex justify-between text-[12px] bg-rose-50 text-rose-600 p-2 rounded border border-rose-100 dark:bg-rose-950/25 mt-1">
                                                    <span>Fraud Flags:</span>
                                                    <span className="font-bold">{order.customerStats.deliveryPartnerStats.fraudReports}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Details */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-primary" />
                            Payment Details
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[13px]">
                                <span className="text-muted-foreground">Method</span>
                                <span className="font-semibold text-foreground uppercase">{order.paymentMethod || 'COD'}</span>
                            </div>
                            {order.paymentTransactionId && (
                                <div className="flex justify-between text-[13px] border-t border-border pt-2">
                                    <span className="text-muted-foreground">Transaction ID</span>
                                    <span className="font-mono font-bold text-foreground">{order.paymentTransactionId}</span>
                                </div>
                            )}
                            {order.paymentScreenshot && (
                                <div className="space-y-2 border-t border-border pt-2">
                                    <span className="text-[13px] text-muted-foreground block">Screenshot</span>
                                    <a href={order.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="block w-full border border-border rounded-lg overflow-hidden hover:opacity-90 transition">
                                        <img src={order.paymentScreenshot} alt="Payment Receipt" className="w-full h-auto object-contain max-h-40" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Shipping Address
                        </h2>
                        <div className="p-4 bg-muted/30 rounded-lg text-[13px] text-foreground leading-relaxed">
                            {order.shippingAddress ? (
                                <>
                                    {order.shippingAddress.addressLine1},<br />
                                    {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2},<br /></>}
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                </>
                            ) : (
                                <p>{order.guestAddress}</p>
                            )}
                        </div>
                        <div className="mt-4 flex items-center gap-3 text-muted-foreground">
                            <Truck className="w-4 h-4" />
                            <span className="text-[12px] font-medium">{order.shippingMethod || 'Standard Delivery'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
