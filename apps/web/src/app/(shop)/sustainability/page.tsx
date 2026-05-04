'use client';

import Link from 'next/link';
import { ArrowLeft, Leaf, Recycle, Package, Sun, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const initiatives = [
  {
    icon: Package,
    title: 'Eco Packaging',
    stat: '60%',
    statLabel: 'plastic reduction in 2026',
    desc: 'All orders are shipped in recycled paper packaging. We eliminated single-use plastic bags across all store locations.',
  },
  {
    icon: Recycle,
    title: 'Circular Fashion',
    stat: '1,200+',
    statLabel: 'garments recycled this year',
    desc: 'Our in-store take-back program accepts worn garments from any brand. Items are sorted for resale, donation, or fibre recycling.',
  },
  {
    icon: Sun,
    title: 'Renewable Energy',
    stat: '40%',
    statLabel: 'of operations on solar',
    desc: 'Our Bariarhat and Chittagong facilities run on rooftop solar panels. We aim to reach 100% renewable energy by 2028.',
  },
  {
    icon: Users,
    title: 'Ethical Sourcing',
    stat: '100%',
    statLabel: 'audited supply chain',
    desc: 'Every supplier is independently audited for fair wages, safe working conditions, and environmental compliance.',
  },
];

export default function SustainabilityPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Company</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Sustainability</h1>
          <p className="text-gray-500 font-medium mt-4 text-sm max-w-xl">
            Fashion should not cost the earth. Here is how we are working to make our business better for people and the planet.
          </p>
        </div>

        <div className="bg-black text-white rounded-3xl p-10 mb-12 flex items-center gap-8">
          <Leaf className="h-12 w-12 text-emerald-400 shrink-0" />
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter mb-2">Our 2030 Commitment</h2>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Net-zero carbon emissions, 100% sustainable sourcing, and zero landfill waste from our operations and packaging by 2030.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {initiatives.map(({ icon: Icon, title, stat, statLabel, desc }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:border-emerald-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Icon className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900">{stat}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{statLabel}</p>
                </div>
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-3">{title}</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2">Want to Learn More?</h2>
            <p className="text-xs text-gray-400 font-medium">Read our blog or get in touch with our team about our sustainability work.</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link href="/contact">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-xl h-11 px-8 text-[10px] font-black uppercase tracking-widest gap-2">
                Contact Us <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
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
