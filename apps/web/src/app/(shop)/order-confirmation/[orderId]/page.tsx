'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Check,
  Package,
  Truck,
  CreditCard,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    // Fetch order from the database via API
    fetch(`/api/orders/${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrder(data.data);
        } else {
          // Fallback: try localStorage for orders placed in the same session
          try {
            const stored = JSON.parse(localStorage.getItem('bigbazar-orders') || '[]');
            const found = stored.find((o: any) => o.id === orderId);
            if (found) {
              setOrder(found);
            } else {
              setError('Order not found.');
            }
          } catch {
            setError('Order not found.');
          }
        }
      })
      .catch(() => {
        // Fallback to localStorage on network error
        try {
          const stored = JSON.parse(localStorage.getItem('bigbazar-orders') || '[]');
          const found = stored.find((o: any) => o.id === orderId);
          if (found) {
            setOrder(found);
          } else {
            setError('Could not load order details.');
          }
        } catch {
          setError('Could not load order details.');
        }
      })
      .finally(() => setIsLoading(false));
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-gray-300 mb-4" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <ShieldCheck className="h-12 w-12 text-rose-500 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Order Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-sm text-sm">
          {error || "We couldn't locate this order. It may have been placed on a different device."}
        </p>
        <Link href="/products">
          <Button className="h-14 px-10 bg-black text-white hover:bg-gray-900 rounded-sm font-bold text-xs uppercase tracking-widest">
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 4);

  // Normalize order shape — handles both DB order and localStorage order
  const orderNumber = order.orderNumber || order.id;
  const shippingAddress = order.shippingAddress || order.shipping || {};
  const paymentMethod = order.paymentMethod || order.payment?.method || 'cod';
  const totalAmount = order.totalAmount ?? order.totals?.total ?? 0;

  return (
    <div className="bg-white min-h-screen font-sans">
      <header className="border-b border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-6 flex justify-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
            BIG BAZAR
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24 text-center">
        {/* Success Message */}
        <div className="flex flex-col items-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/10"
          >
            <Check className="h-10 w-10 text-white stroke-[3px]" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight mb-4">
            Thank you for your order
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Your order has been received and is being prepared for shipment. You will receive an update once it's on its way.
          </p>
          <div className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Order Number: <span className="text-black ml-1">#{orderNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left bg-gray-50 rounded-sm p-10 md:p-12">
          {/* Shipping Details */}
          <div className="space-y-10">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Shipping To
              </h3>
              <div className="text-sm font-medium text-gray-900 leading-relaxed uppercase">
                {shippingAddress.fullName}
                <br />
                {shippingAddress.address}
                <br />
                {shippingAddress.upazila ? `${shippingAddress.upazila}, ` : ''}
                {shippingAddress.district}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Truck className="h-3 w-3" /> Estimated Delivery
              </h3>
              <div className="text-sm font-medium text-gray-900 uppercase">
                {estimatedDate.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Payment & Total */}
          <div className="space-y-10">
            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <CreditCard className="h-3 w-3" /> Payment Method
              </h3>
              <div className="text-sm font-medium text-gray-900 uppercase">
                {paymentMethod === 'cod' || paymentMethod === 'CASH_ON_DELIVERY'
                  ? 'Cash on Delivery'
                  : paymentMethod.toUpperCase()}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Package className="h-3 w-3" /> Order Total
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                Tk{Number(totalAmount).toLocaleString()}.00
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-6">
          <Link href="/products">
            <Button className="h-16 px-12 bg-black text-white hover:bg-gray-900 rounded-sm font-bold text-xs uppercase tracking-widest gap-3">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <Link
              href="/account/orders"
              className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors border-b border-gray-100 hover:border-black pb-1"
            >
              Manage your orders
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
