'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    step: '01',
    title: 'Initiate Return',
    desc: 'Contact us within 30 days of delivery via email or our Contact page with your order number and reason for return.',
  },
  {
    step: '02',
    title: 'Pack Your Item',
    desc: 'Repack the item securely in its original packaging with all tags intact. Include a note with your order number.',
  },
  {
    step: '03',
    title: 'Ship It Back',
    desc: 'Drop off the parcel at any courier office. Share the tracking number with us via email or WhatsApp.',
  },
  {
    step: '04',
    title: 'Refund / Exchange',
    desc: 'Once received and inspected, we process your refund or dispatch the replacement within 3–5 business days.',
  },
];

export default function ReturnsPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Help Center</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Returns & Exchanges</h1>
          <p className="text-gray-400 font-medium mt-4 text-sm">30-day hassle-free returns on all eligible items.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4">{s.step}</div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-3">{s.title}</h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Eligible for Return</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              {[
                'Unused items with tags attached',
                'Items in original, undamaged packaging',
                'Defective or incorrectly shipped items',
                'Returns requested within 30 days',
              ].map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-5 w-5 text-red-400" />
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Not Eligible</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              {[
                'Used or washed items',
                'Items without original tags',
                'Sale or clearance items',
                'Requests after 30 days of delivery',
              ].map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-gray-400 shrink-0" />
            <p className="text-sm font-medium text-gray-500">
              Refunds processed within <strong className="text-gray-900 font-black">3–5 business days</strong> of receiving the return.
            </p>
          </div>
          <Link href="/contact">
            <Button variant="outline" className="rounded-xl h-11 px-8 text-[10px] font-black uppercase tracking-widest border-gray-200 shrink-0">
              Contact Support
            </Button>
          </Link>
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
