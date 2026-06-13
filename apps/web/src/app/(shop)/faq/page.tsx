'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery within Dhaka takes 2–3 business days. Outside Dhaka, allow 4–7 business days. Express options are available at checkout.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept bKash, Nagad, and Cash on Delivery (COD). All digital payments are processed securely.',
  },
  {
    q: 'Can I return or exchange an item?',
    a: 'Please inspect your order upon delivery in front of the courier rider. Returns and exchanges are only accepted at the time of delivery. Once the rider leaves, we cannot process return requests. For damaged items, contact us within 48 hours with photos.',
  },
  {
    q: 'How do I track my order?',
    a: 'After shipment, you will receive an SMS with a tracking ID. You can also visit our Track Order page and enter your order number and email.',
  },
  {
    q: 'Do you ship outside Bangladesh?',
    a: 'Currently, we ship only within Bangladesh. International shipping will be available soon.',
  },
  {
    q: 'How do I find the right size?',
    a: 'Visit our Size Guide page for detailed measurement charts for Men, Women, and Kids clothing.',
  },
  {
    q: 'What if I receive a damaged item?',
    a: 'Please contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or full refund at no extra cost.',
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="max-w-3xl mx-auto px-6 py-12 lg:py-24">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-neutral-300" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900 tracking-tight">Frequently Asked Questions</h1>
        </div>

        <div className="space-y-2">
          {faqs.map((item, i) => (
            <div key={i} className="bg-neutral-50 border border-neutral-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-8 py-6 text-left"
              >
                <span className="text-sm font-black text-gray-900 uppercase tracking-tight pr-4">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-8 pb-6 text-gray-500 font-medium leading-relaxed text-sm border-t border-gray-50">
                  <p className="pt-4">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-neutral-50 rounded-xl p-8 border border-neutral-100 text-center">
          <p className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2">Still have questions?</p>
          <p className="text-gray-400 text-sm font-medium mb-8">Our team is ready to help.</p>
          <Link href="/contact">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-xl h-12 px-8 text-[10px] font-black uppercase tracking-widest">
              Contact Us
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
