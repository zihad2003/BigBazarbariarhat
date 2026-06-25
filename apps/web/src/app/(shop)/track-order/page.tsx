'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Package, Loader2, Truck, CheckCircle2, Clock, XCircle, CreditCard, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OrderData {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  items: {
    id: string;
    product: { name: string; images: any };
    quantity: number;
    price: number;
  }[];
  shippingAddress: any;
}

const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

function getStatusIcon(status: string) {
  switch (status) {
    case 'PENDING': return <Clock className="h-5 w-5" />;
    case 'PROCESSING': return <Package className="h-5 w-5" />;
    case 'SHIPPED': return <Truck className="h-5 w-5" />;
    case 'DELIVERED': return <CheckCircle2 className="h-5 w-5" />;
    case 'CANCELLED': return <XCircle className="h-5 w-5" />;
    default: return <Clock className="h-5 w-5" />;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'PENDING': return 'Order Placed';
    case 'PROCESSING': return 'Processing';
    case 'SHIPPED': return 'Shipped';
    case 'DELIVERED': return 'Delivered';
    case 'CANCELLED': return 'Cancelled';
    default: return status;
  }
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber.trim())}`);
      const result = await res.json();

      if (result.success && result.data) {
        // Verify phone matches (for guest orders, compare with customerPhone or shippingAddress phone)
        const orderData = result.data;
        const shippingAddr = typeof orderData.shippingAddress === 'string'
          ? (() => { try { return JSON.parse(orderData.shippingAddress); } catch { return null; } })()
          : orderData.shippingAddress;

        const orderPhone = orderData.customerPhone || shippingAddr?.phone || '';
        const inputPhone = phone.trim().replace(/^(\+?880|0)/, '');
        const storedPhone = orderPhone.replace(/^(\+?880|0)/, '');

        if (storedPhone && inputPhone && storedPhone !== inputPhone) {
          setError('Order number and phone number do not match. Please check and try again.');
        } else {
          setOrder(orderData);
        }
      } else {
        setError('No order found with this order number. Please check and try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? (order.status === 'CANCELLED' ? -1 : statusSteps.indexOf(order.status)) : -1;

  return (
    <div className="bg-white min-h-screen font-sans text-neutral-900">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 lg:py-20">

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-neutral-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Help Center</span>
            <div className="h-px w-8 bg-neutral-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900 tracking-tight">Track Order</h1>
          <p className="text-neutral-400 text-sm mt-3">Enter your order details to see the latest status.</p>
        </div>

        {/* Search Card */}
        <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Order Number</label>
              <Input
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. ORD-1782372968422-7A87E3"
                className="h-12 rounded-xl bg-white border-neutral-200 font-medium uppercase tracking-tight text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-neutral-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Phone Number</label>
              <Input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01857045449"
                className="h-12 rounded-xl bg-white border-neutral-200 font-medium text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-neutral-900"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl text-[11px] font-black uppercase tracking-widest gap-2 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? 'Searching...' : 'Track Order'}
            </Button>
          </form>

          {/* Error State */}
          {searched && error && (
            <div className="mt-8 pt-8 border-t border-neutral-200 text-center space-y-4">
              <Package className="h-10 w-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-900 uppercase tracking-tight">No order found</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                {error}{' '}
                <Link href="/contact" className="underline font-bold text-neutral-900">Contact support</Link>.
              </p>
            </div>
          )}
        </div>

        {/* Order Result */}
        {order && (
          <div className="mt-10 space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {/* Order Header */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Order Number</p>
                  <p className="text-lg font-bold text-neutral-900 font-mono">#{order.orderNumber}</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Placed On</p>
                  <p className="text-sm font-semibold text-neutral-700">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6">Order Status</h3>

              {order.status === 'CANCELLED' ? (
                <div className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-100 rounded-lg">
                  <XCircle className="h-8 w-8 text-rose-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-rose-700">Order Cancelled</p>
                    <p className="text-xs text-rose-500 mt-1">This order has been cancelled. If you have questions, please contact support.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200 z-0" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-emerald-500 z-10 transition-all duration-700"
                    style={{ width: `${Math.max(0, currentStepIndex) / (statusSteps.length - 1) * 100}%` }}
                  />

                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step} className="relative z-20 flex flex-col items-center text-center" style={{ width: `${100 / statusSteps.length}%` }}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200'
                            : 'bg-white border-neutral-200 text-neutral-300'
                        } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}>
                          {getStatusIcon(step)}
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mt-3 ${
                          isCompleted ? 'text-emerald-600' : 'text-neutral-300'
                        }`}>
                          {getStatusLabel(step)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
                <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Order Items</h3>
              </div>
              <div className="divide-y divide-neutral-100">
                {order.items.map((item) => {
                  let imgUrl = '';
                  try {
                    const images = typeof item.product.images === 'string'
                      ? JSON.parse(item.product.images)
                      : item.product.images;
                    imgUrl = Array.isArray(images) && images.length > 0 ? (images[0].url || images[0]) : '';
                  } catch {}

                  return (
                    <div key={item.id} className="p-5 flex items-center gap-4">
                      <div className="w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200">
                        {imgUrl ? (
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-neutral-900">৳{(Number(item.price) * item.quantity).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
              <div className="p-5 border-t border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
                <span className="text-sm font-bold text-neutral-700">Total</span>
                <span className="text-lg font-bold text-neutral-900">৳{Number(order.totalAmount).toLocaleString()}</span>
              </div>
            </div>

            {/* Payment & Shipping Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-neutral-400" />
                  <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Payment</h3>
                </div>
                <p className="text-sm font-semibold text-neutral-900 uppercase">{order.paymentMethod || 'COD'}</p>
                <p className={`text-xs font-bold mt-1 ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.paymentStatus === 'PAID' ? 'Paid' : order.paymentStatus === 'REFUNDED' ? 'Refunded' : 'Pending'}
                </p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Shipping</h3>
                </div>
                {(() => {
                  const addr = typeof order.shippingAddress === 'string'
                    ? (() => { try { return JSON.parse(order.shippingAddress); } catch { return null; } })()
                    : order.shippingAddress;
                  if (addr) {
                    return (
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {addr.address || addr.addressLine1 || ''}{addr.upazila ? `, ${addr.upazila}` : ''}{addr.district ? `, ${addr.district}` : ''}
                      </p>
                    );
                  }
                  return <p className="text-sm text-neutral-400">N/A</p>;
                })()}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-neutral-400 font-medium mt-8">
          Your order number can be found in the confirmation SMS or email sent after purchase.
        </p>

        <div className="mt-10 text-center">
          <Link href="/">
            <Button variant="ghost" className="text-neutral-400 hover:text-neutral-900 text-[10px] font-black uppercase tracking-widest gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Shop
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
