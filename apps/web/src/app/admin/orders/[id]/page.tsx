'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Package,
    MapPin,
    User as UserIcon,
    Mail,
    Phone,
    Printer,
    Clock,
    CreditCard,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrdersService, Order, OrderStatus, PaymentStatus } from '@bigbazar/shared';

interface GuestAddress {
    addressLine1?: string;
    city?: string;
}

export default function OrderDetailPage() {
    const params = useParams() as { id: string };
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            const id = params?.id as string;
            if (!id) return;

            try {
                const response = await OrdersService.getOrderById(id);
                if (response.success && response.data) {
                    setOrder(response.data);
                } else {
                    router.push('/admin/orders');
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [params?.id, router]);

    const handleStatusUpdate = async (newStatus: OrderStatus) => {
        if (!order) return;
        setUpdating(true);
        try {
            const response = await OrdersService.updateOrderStatus(order.id, { status: newStatus });
            if (response.success && response.data) {
                setOrder(response.data);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdating(false);
        }
    };

    const handlePaymentStatusUpdate = async (newStatus: PaymentStatus) => {
        if (!order) return;
        setUpdating(true);
        try {
            const response = await OrdersService.updateOrderStatus(order.id, { status: order.status, paymentStatus: newStatus });
            if (response.success && response.data) {
                setOrder(response.data);
            }
        } catch (error) {
            console.error('Failed to update payment status:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!order) return null;

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'CONFIRMED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'PROCESSING': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'SHIPPED': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'REFUNDED': return 'bg-gray-50 text-gray-600 border-gray-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" className="h-12 w-12 rounded-xl p-0 hover:bg-gray-100">
                            <ArrowLeft className="h-5 w-5 text-gray-500" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Order #{order.orderNumber}</h1>
                            <Badge className={`uppercase tracking-widest text-[10px] py-1 px-3 border ${getStatusColor(order.status)}`}>
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200 uppercase tracking-widest text-[10px] font-black hover:border-black gap-2">
                        <Printer className="h-4 w-4" />
                        Print Invoice
                    </Button>

                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                        <div className="relative group">
                            <Button
                                disabled={updating}
                                className="h-12 px-6 bg-black text-white rounded-xl uppercase tracking-widest text-[10px] font-black hover:scale-105 transition-all shadow-xl shadow-black/20 gap-2">
                                {updating ? <span className="animate-spin">⌛</span> : 'Update Status'}
                            </Button>
                            {/* Dropdown Menu Mockup - In real app use DropdownMenu component */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden hidden group-hover:block z-50">
                                {['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(status as OrderStatus)}
                                        className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 uppercase tracking-wider block"
                                    >
                                        Mark as {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                            <Package className="h-5 w-5 text-gray-400" />
                            Order Items
                        </h3>
                        <div className="space-y-6">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center py-4 border-b border-gray-50 last:border-0">
                                    <div className="h-20 w-20 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                                        {item.product?.images?.[0] ? (
                                            <img src={item.product.images[0].url} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className="h-8 w-8 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate">{item.productName}</h4>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                                            {item.variantName || `SKU: ${item.sku}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-900">৳{item.unitPrice.toLocaleString()}</p>
                                        <p className="text-xs text-gray-400 font-bold mt-1">x {item.quantity}</p>
                                    </div>
                                    <div className="text-right w-24">
                                        <p className="font-black text-gray-900">৳{item.totalPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50 space-y-3">
                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                <span>Subtotal</span>
                                <span>৳{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                <span>Shipping</span>
                                <span>৳{order.shippingCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-gray-500">
                                <span>Tax</span>
                                <span>৳{order.taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-gray-50 mt-4">
                                <span className="text-base font-black text-gray-900 uppercase tracking-widest">Total Amount</span>
                                <span className="text-2xl font-black text-gray-900 tracking-tighter">৳{order.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Activity - Placeholder */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm opacity-50 pointer-events-none">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-400" />
                            Order Activity
                        </h3>
                        <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pl-8 py-2">
                            <div className="relative">
                                <div className="absolute -left-[39px] w-5 h-5 rounded-full bg-black border-4 border-white shadow-sm" />
                                <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Order Placed</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Payment Info */}
                <div className="space-y-8">
                    {/* Customer Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            Customer Details
                        </h3>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center">
                                <span className="text-lg font-black text-gray-400">
                                    {(order.user?.firstName?.[0] || order.guestName?.[0] || 'G')}
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{order.user ? `${order.user.firstName} ${order.user.lastName}` : order.guestName}</p>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                    {order.user ? 'Registered Member' : 'Guest Customer'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-xs font-bold text-gray-700 truncate">{order.user?.email || order.guestEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-xs font-bold text-gray-700">{order.user?.phone || order.guestPhone || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <MapPin className="h-3 w-3" /> Shipping Address
                            </h4>
                            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 font-medium leading-relaxed">
                                {order.shippingAddress ? (
                                    <>
                                        <p className="font-bold text-gray-900 mb-1">{order.shippingAddress.addressLine1}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                    </>
                                ) : (
                                    <p className="italic text-gray-400">
                                        {order.guestAddress && (order.guestAddress as unknown as GuestAddress).addressLine1 ? (
                                            <span>{(order.guestAddress as unknown as GuestAddress).addressLine1}, {(order.guestAddress as unknown as GuestAddress).city}</span>
                                        ) : (
                                            'No address provided'
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            Payment Info
                        </h3>

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                            <Badge className={
                                order.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    order.paymentStatus === 'REFUNDED' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                        'bg-amber-50 text-amber-600 border-amber-100'
                            }>
                                {order.paymentStatus}
                            </Badge>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500">Method</span>
                                <span className="text-xs font-black text-gray-900 uppercase">{order.paymentMethod?.replace(/_/g, ' ')}</span>
                            </div>
                            {order.paymentMethod === 'CASH_ON_DELIVERY' && (
                                <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                                    Payment to be collected upon delivery of goods.
                                </p>
                            )}
                        </div>

                        {order.paymentStatus !== 'PAID' && order.status !== 'CANCELLED' && (
                            <Button
                                onClick={() => handlePaymentStatusUpdate('PAID')}
                                disabled={updating}
                                className="w-full h-12 bg-white border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-widest"
                            >
                                Mark as Paid
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
