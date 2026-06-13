'use client';

import Link from 'next/link';
import { ArrowLeft, Truck, Clock, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const zones = [
  { zone: 'Dhaka City', cost: 'Free over ৳2000 / ৳80 below', time: '2–3 business days' },
  { zone: 'Chittagong', cost: 'Free over ৳2000 / ৳100 below', time: '3–5 business days' },
  { zone: 'Other Districts', cost: '৳120 flat', time: '5–7 business days' },
  { zone: 'Remote Areas', cost: '৳150 flat', time: '7–10 business days' },
];

export default function ShippingPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-neutral-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-neutral-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900 tracking-tight">Shipping Info</h1>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Truck, label: 'Free Shipping', desc: 'For Mirsharai' },
            { icon: Clock, label: '2–7 Days', desc: 'Delivery timeframe' },
            { icon: Package, label: 'Order Cut-off', desc: '2 PM daily' },
          ].map(({ icon: Icon, label, desc }, i) => (
            <div key={i} className="bg-neutral-50 rounded-xl p-8 border border-neutral-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 border border-neutral-100 shadow-sm">
                <Icon className="h-5 w-5 text-neutral-700" />
              </div>
              <p className="text-sm font-bold text-neutral-900 uppercase tracking-tight">{label}</p>
              <p className="text-xs text-neutral-400 font-medium mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {/* Zones Table */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden mb-12">
          <div className="px-8 py-6 border-b border-neutral-100 flex items-center gap-3">
            <MapPin className="h-4 w-4 text-neutral-400" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Shipping Zones & Rates</h2>
          </div>
          <div className="divide-y divide-neutral-50">
            <div className="grid grid-cols-3 px-8 py-3 bg-neutral-50">
              {['Zone', 'Cost', 'Delivery Time'].map((h) => (
                <span key={h} className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{h}</span>
              ))}
            </div>
            {zones.map((z, i) => (
              <div key={i} className="grid grid-cols-3 px-8 py-5 hover:bg-neutral-50 transition-colors">
                <span className="text-sm font-bold text-neutral-900">{z.zone}</span>
                <span className="text-sm font-medium text-neutral-500">{z.cost}</span>
                <span className="text-sm font-medium text-neutral-500">{z.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Card */}
        <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Notes & Guidelines</h2>
          <ul className="space-y-3 text-sm text-neutral-500 leading-relaxed">
            {[
              'Orders placed after 2 PM are processed the next business day.',
              'Shipping times may be affected by public holidays and severe weather conditions.',
              'We ship Monday through Saturday. No Sunday dispatch.',
              'You will receive SMS notifications when your order is dispatched and out for delivery.',
            ].map((note, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 text-center">
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
