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
    <div className="bg-white min-h-screen font-sans text-neutral-900">
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        
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
                placeholder="e.g. BB-20240001"
                className="h-12 rounded-xl bg-white border-neutral-200 font-medium uppercase tracking-tight text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-neutral-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Email Address</label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 rounded-xl bg-white border-neutral-200 font-medium text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-neutral-900"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl text-[11px] font-black uppercase tracking-widest gap-2 transition-all"
            >
              <Search className="h-4 w-4" /> Track Order
            </Button>
          </form>

          {searched && (
            <div className="mt-8 pt-8 border-t border-neutral-200 text-center space-y-4">
              <Package className="h-10 w-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-900 uppercase tracking-tight">No order found</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Please check your order number and email, or{' '}
                <Link href="/contact" className="underline font-bold text-neutral-900">contact support</Link>.
              </p>
            </div>
          )}
        </div>

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
