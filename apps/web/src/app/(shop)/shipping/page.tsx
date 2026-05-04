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
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Help Center</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Shipping Info</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Truck, label: 'Free Shipping', desc: 'On orders over ৳2000' },
            { icon: Clock, label: '2–7 Days', desc: 'Delivery timeframe' },
            { icon: Package, label: 'Order Cut-off', desc: '2 PM daily' },
          ].map(({ icon: Icon, label, desc }, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-gray-900" />
              </div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{label}</p>
              <p className="text-xs text-gray-400 font-medium mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Shipping Zones & Rates</h2>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="grid grid-cols-3 px-8 py-3 bg-gray-50">
              {['Zone', 'Cost', 'Delivery'].map((h) => (
                <span key={h} className="text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</span>
              ))}
            </div>
            {zones.map((z, i) => (
              <div key={i} className="grid grid-cols-3 px-8 py-5 hover:bg-gray-50 transition-colors">
                <span className="text-sm font-bold text-gray-900">{z.zone}</span>
                <span className="text-sm font-medium text-gray-500">{z.cost}</span>
                <span className="text-sm font-medium text-gray-500">{z.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Notes</h2>
          <ul className="space-y-3 text-sm text-gray-500 font-medium">
            {[
              'Orders placed after 2 PM are processed the next business day.',
              'Shipping times may be affected by public holidays and severe weather.',
              'We ship Monday through Saturday. No Sunday dispatch.',
              'You will receive SMS notifications when your order is dispatched and out for delivery.',
            ].map((note, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

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
