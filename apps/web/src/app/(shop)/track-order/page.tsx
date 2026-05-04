'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <main className="max-w-xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Help Center</span>
            <div className="h-px w-8 bg-black" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Track Order</h1>
          <p className="text-gray-400 font-medium mt-4 text-sm">Enter your order details to see the latest status.</p>
        </div>

        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Number</label>
              <Input
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. BB-20240001"
                className="h-14 rounded-xl bg-gray-50 border-gray-100 font-bold uppercase tracking-tight"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-14 rounded-xl bg-gray-50 border-gray-100 font-bold"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-14 bg-black text-white hover:bg-gray-800 rounded-xl text-[11px] font-black uppercase tracking-widest gap-2"
            >
              <Search className="h-4 w-4" /> Track Order
            </Button>
          </form>

          {searched && (
            <div className="mt-8 pt-8 border-t border-gray-100 text-center space-y-4">
              <Package className="h-10 w-10 text-gray-200 mx-auto" />
              <p className="text-sm font-black text-gray-900 uppercase tracking-tight">No order found</p>
              <p className="text-xs text-gray-400 font-medium">
                Please check your order number and email, or{' '}
                <Link href="/contact" className="underline">contact support</Link>.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 font-medium mt-8">
          Your order number is in the confirmation SMS or email sent after purchase.
        </p>

        <div className="mt-10 text-center">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-black text-[10px] font-black uppercase tracking-widest gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Shop
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
