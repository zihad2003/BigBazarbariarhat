'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Ruler, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tabs = ['Men', 'Women', 'Kids'] as const;
type Tab = (typeof tabs)[number];

const sizes: Record<Tab, { size: string; chest: string; waist: string; hip: string }[]> = {
  Men: [
    { size: 'S',   chest: '36–38"', waist: '30–32"', hip: '37–39"' },
    { size: 'M',   chest: '38–40"', waist: '32–34"', hip: '39–41"' },
    { size: 'L',   chest: '40–42"', waist: '34–36"', hip: '41–43"' },
    { size: 'XL',  chest: '42–44"', waist: '36–38"', hip: '43–45"' },
    { size: 'XXL', chest: '44–46"', waist: '38–40"', hip: '45–47"' },
  ],
  Women: [
    { size: 'XS', chest: '32–34"', waist: '25–27"', hip: '35–37"' },
    { size: 'S',  chest: '34–36"', waist: '27–29"', hip: '37–39"' },
    { size: 'M',  chest: '36–38"', waist: '29–31"', hip: '39–41"' },
    { size: 'L',  chest: '38–40"', waist: '31–33"', hip: '41–43"' },
    { size: 'XL', chest: '40–42"', waist: '33–35"', hip: '43–45"' },
  ],
  Kids: [
    { size: '2–3Y',   chest: '21"', waist: '20"', hip: '22"' },
    { size: '4–5Y',   chest: '23"', waist: '22"', hip: '24"' },
    { size: '6–7Y',   chest: '25"', waist: '23"', hip: '26"' },
    { size: '8–9Y',   chest: '27"', waist: '24"', hip: '28"' },
    { size: '10–11Y', chest: '29"', waist: '25"', hip: '30"' },
  ],
};

export default function SizeGuidePage() {
  const [active, setActive] = useState<Tab>('Men');

  return (
    <div className="bg-white min-h-screen font-sans text-neutral-900 pb-20">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-neutral-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900 tracking-tight">Size Guide</h1>
          <p className="text-neutral-400 text-sm mt-3">All measurements are in inches (&#34;) unless stated otherwise.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                active === tab
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-400 border border-neutral-100 hover:border-neutral-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Size Table */}
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden mb-10">
          <div className="grid grid-cols-4 px-8 py-4 bg-neutral-50 border-b border-neutral-100">
            {['Size', 'Chest', 'Waist', 'Hip'].map((h) => (
              <span key={h} className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-neutral-50">
            {sizes[active].map((row, i) => (
              <div key={i} className="grid grid-cols-4 px-8 py-5 hover:bg-neutral-50 transition-colors">
                <span className="text-sm font-bold text-neutral-900">{row.size}</span>
                <span className="text-sm font-medium text-neutral-500">{row.chest}</span>
                <span className="text-sm font-medium text-neutral-500">{row.waist}</span>
                <span className="text-sm font-medium text-neutral-500">{row.hip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Measuring Guide */}
        <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
              <Ruler className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-neutral-900">How to Measure</h2>
          </div>
          
          <ul className="space-y-4 text-sm text-neutral-500 leading-relaxed pl-1">
            {[
              { label: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape level.' },
              { label: 'Waist', desc: 'Measure around your natural waistline, the narrowest part of your torso.' },
              { label: 'Hip',   desc: 'Measure around the fullest part of your hips, approximately 8" below your waistline.' },
            ].map(({ label, desc }) => (
              <li key={label} className="flex gap-4">
                <span className="font-bold text-neutral-900 w-16 shrink-0">{label}</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>

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
