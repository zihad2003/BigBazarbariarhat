'use client';

import Link from 'next/link';
import { ArrowLeft, CreditCard, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#fafafa] min-h-screen font-sans">
      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Legal</span>
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">Refund Policy</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-4">Effective: 2026.01.01 | Status: Active</p>
        </div>

        <div className="bg-white rounded-3xl p-10 lg:p-12 border border-gray-100 shadow-sm space-y-10 mb-8">

          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Eligibility</h2>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Refunds are available for items returned within <strong className="text-gray-900">30 days</strong> of delivery.
              Items must be unused, unwashed, and in their original packaging with all tags attached. Proof of purchase is required.
            </p>
          </section>

          <div className="border-t border-gray-50" />

          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Refund Methods</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              {[
                { label: 'bKash / Nagad', desc: 'Refund sent to the original payment number within 3–5 business days.' },
                { label: 'Cash on Delivery', desc: 'Refund issued as store credit or via bKash/Nagad upon request.' },
                { label: 'Defective Items', desc: 'Full refund or replacement, with no return shipping cost to the customer.' },
              ].map(({ label, desc }, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 shrink-0" />
                  <span><strong className="text-gray-900">{label}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-gray-50" />

          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Processing Time</h2>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Once your return is received and inspected (usually within 1–2 business days), we will notify you by SMS.
              The refund is then processed within <strong className="text-gray-900">3–5 business days</strong>.
            </p>
          </section>

          <div className="border-t border-gray-50" />

          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Non-Refundable Items</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              {[
                'Used or washed items',
                'Items returned after 30 days',
                'Final sale or clearance items',
                'Items without original tags or packaging',
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Questions about your refund?</p>
          <Link href="/contact">
            <Button variant="outline" className="rounded-xl h-11 px-8 text-[10px] font-black uppercase tracking-widest border-gray-100">
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
