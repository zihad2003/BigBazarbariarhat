'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stores = [
  {
    name: 'Bariarhat Central (Flagship)',
    address: 'Bariarhat Central Plaza, Ground Floor, Mirsharai, Chittagong',
    phone: '+880 1857-045449',
    hours: 'Sat–Thu: 10 AM – 9 PM  |  Fri: 2 PM – 9 PM',
    flagship: true,
  },
  {
    name: 'Chittagong City Outlet',
    address: 'GEC Circle Plaza, East Wing, Khulshi, Chittagong',
    phone: '+880 1857-045449',
    hours: 'Sat–Thu: 10 AM – 9 PM  |  Fri: 2 PM – 9 PM',
    flagship: false,
  },
  {
    name: 'Dhaka Collection Point',
    address: 'Gulshan-2 Market, Block B, Gulshan, Dhaka',
    phone: '+880 1857-045449',
    hours: 'Daily: 10 AM – 9 PM',
    flagship: false,
  },
];

export default function StoresPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-neutral-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-neutral-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Company</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900 tracking-tight">Store Locations</h1>
          <p className="text-neutral-400 text-sm mt-3">{stores.length} outlets and collection points across Bangladesh.</p>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stores.map((store, i) => (
            <div
              key={i}
              className="bg-neutral-50 rounded-xl border border-neutral-100 p-8 hover:border-neutral-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">Big Bazar</p>
                    <h3 className="text-base font-bold text-neutral-900">{store.name}</h3>
                  </div>
                  {store.flagship && (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-neutral-900 text-white px-3 py-1 rounded-lg">
                      Flagship
                    </span>
                  )}
                </div>
                
                <div className="space-y-4 text-sm text-neutral-500">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{store.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
