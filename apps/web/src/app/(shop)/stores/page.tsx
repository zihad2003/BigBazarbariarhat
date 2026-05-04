'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stores = [
  {
    name: 'Bariarhat Central',
    address: 'Bariarhat Central Plaza, Ground Floor, Mirsarai, Chittagong',
    phone: '+880 1234-567890',
    hours: 'Sat–Thu: 10 AM – 9 PM  |  Fri: 2 PM – 9 PM',
    flagship: true,
  },
  {
    name: 'Chittagong City',
    address: '45 GEC Circle, Khulshi, Chittagong',
    phone: '+880 1876-543210',
    hours: 'Sat–Thu: 10 AM – 9 PM  |  Fri: 2 PM – 9 PM',
    flagship: false,
  },
  {
    name: 'Dhaka Gulshan',
    address: 'Shop 12, Gulshan-2 Market, Gulshan, Dhaka',
    phone: '+880 1654-321098',
    hours: 'Daily: 10 AM – 9 PM',
    flagship: false,
  },
  {
    name: 'Dhaka Dhanmondi',
    address: '22 Road 7, Dhanmondi, Dhaka',
    phone: '+880 1712-345678',
    hours: 'Daily: 10 AM – 9 PM',
    flagship: false,
  },
];

export default function StoresPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Company</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Store Locations</h1>
          <p className="text-gray-400 font-medium mt-4 text-sm">{stores.length} stores across Bangladesh.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stores.map((store, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Big Bazar</p>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{store.name}</h3>
                </div>
                {store.flagship && (
                  <span className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full">
                    Flagship
                  </span>
                )}
              </div>
              <div className="space-y-3 text-xs font-medium text-gray-500">
                <div className="flex gap-3">
                  <MapPin className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </div>
                <div className="flex gap-3">
                  <Phone className="h-4 w-4 text-gray-300 shrink-0" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex gap-3">
                  <Clock className="h-4 w-4 text-gray-300 shrink-0" />
                  <span>{store.hours}</span>
                </div>
              </div>
            </div>
          ))}
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
