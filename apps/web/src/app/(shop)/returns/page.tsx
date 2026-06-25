'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertTriangle, Truck, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const policies = [
  {
    step: '01',
    title: 'পণ্য যাচাইকরণ (Inspect with Rider)',
    desc: 'ডেলিভারি রাইডার পৌঁছানোর পর অনুগ্রহ করে আপনার পোশাক বা পণ্যের সাইজ, ফেব্রিক এবং কালার সম্পূর্ণভাবে চেক করে নিন।',
  },
  {
    step: '02',
    title: 'পছন্দ হলে গ্রহণ করুন (Keep the Product)',
    desc: 'পণ্যটি আপনার পছন্দ হলে ডেলিভারি রাইডারকে ক্যাশ অন ডেলিভারির বকেয়া বিল পরিশোধ করে আনন্দের সাথে পণ্যটি নিজের করে নিন।',
  },
  {
    step: '03',
    title: 'পছন্দ না হলে সাথে সাথে রিটার্ন (Return on the Spot)',
    desc: 'যদি সাইজ বা ফিটিং-এ সমস্যা থাকে অথবা পণ্যটি অপছন্দ হয়, তবে রাইডারের নিকট সাথে সাথেই পণ্যটি রিটার্ন করে দিন। এই ক্ষেত্রে আপনাকে শুধুমাত্র ডেলিভারি চার্জ পরিশোধ করতে হবে।',
  },
  {
    step: '04',
    title: 'পরবর্তীতে কোনো রিটার্ন নয় (No Post-Delivery Return)',
    desc: 'রাইডার চলে যাওয়ার পর কোনো পণ্য পরিবর্তন, এক্সচেঞ্জ বা রিটার্ন করার সুযোগ নেই। সকল সিদ্ধান্ত রাইডার উপস্থিত থাকা অবস্থায় তাৎক্ষণিকভাবে গ্রহণ করতে হবে।',
  },
];

export default function ReturnsPage() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 pb-20">
      {/* Decorative Blur Overlays */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-24 relative z-10">
        
        {/* Back Button and Path */}
        <div className="mb-12">
          <Link href="/">
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Shop
            </button>
          </Link>
        </div>

        {/* Header Block */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-0.5 w-8 bg-[hsl(var(--primary))]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--primary))]">Support Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-playfair uppercase tracking-tight text-slate-900 leading-none">
            ডেলিভারি ও রিটার্ন পলিসি
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 mt-3">
            Delivery & On-the-spot Return Policy
          </p>
          <div className="h-px w-full bg-slate-100 mt-8" />
        </div>

        {/* Crucial Warning Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50/50 border border-rose-100 rounded-3xl p-8 mb-16 flex flex-col md:flex-row items-start gap-6 shadow-sm"
        >
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-black text-rose-950 uppercase tracking-tight">অত্যন্ত গুরুত্বপূর্ণ নোটিশ (Must Know)</h3>
            <p className="text-sm text-rose-900 leading-relaxed font-semibold">
              আমাদের সকল পার্সেল কাস্টমারকে রাইডারের সামনে চেক করে রিসিভ করতে হবে। যদি পণ্য অপছন্দ হয় বা সাইজে না মিলে, তবে রাইডার উপস্থিত থাকা অবস্থাতেই ফেরত দিতে হবে। রাইডার চলে আসার পর পরবর্তীতে কোনো এক্সচেঞ্জ বা রিটার্ন করা যাবে না।
            </p>
            <p className="text-xs text-rose-700/80 leading-relaxed font-medium">
              We highly request you to inspect your items immediately in front of the courier rider. If you wish to return, send it back on the spot and pay ONLY the delivery fee. Returns are strictly not accepted after the rider has left your premises.
            </p>
          </div>
        </motion.div>

        {/* Grid Steps layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {policies.map((p, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all duration-300 group flex gap-5"
            >
              <div className="text-xl font-black text-rose-500/20 group-hover:text-rose-500 font-mono transition-colors shrink-0">
                {p.step}
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {p.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verification Summary details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 text-emerald-600">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">রিটার্ন করার নিয়ম (On-the-spot Return)</h2>
              </div>
              <ul className="space-y-4 text-xs font-semibold text-slate-500 leading-relaxed pl-2">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>রাইডার আপনার ঠিকানায় পৌঁছানোর পর পার্সেলটি খুলুন।</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>পণ্যটি সম্পূর্ণ ভালো করে চেক করে নিশ্চিত হয়ে নিন।</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>পছন্দ না হলে পার্সেলটি সরাসরি রাইডারের হাতে ফেরত দিন এবং ডেলিভারি চার্জ পরিশোধ করুন।</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 text-rose-500">
                <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">পরবর্তীতে অযোগ্য কেস (Non-Eligible Post-delivery)</h2>
              </div>
              <ul className="space-y-4 text-xs font-semibold text-slate-500 leading-relaxed pl-2">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>রাইডার চলে যাওয়ার পর পণ্য পছন্দ হয়নি বলে রিটার্ন দাবি করা।</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>পণ্য ব্যবহারের পর সাইজ বা ফিটিং এক্সচেঞ্জ করার অনুরোধ করা।</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>পণ্য ধুয়ে ফেলার বা ট্যাগ ছিঁড়ে ফেলার পর কোনো ক্লেইম করা।</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dynamic CTA Support Block */}
        <div className="bg-slate-950 text-white rounded-[2rem] p-8 md:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-slate-900/10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400 shrink-0">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-rose-400">আপনার কি কোনো প্রশ্ন আছে?</h3>
              <p className="text-xs font-semibold text-slate-300 mt-1 leading-relaxed">
                ডেলিভারি এবং রিটার্ন পলিসি সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের সাপোর্ট টীমের সাথে সরাসরি যোগাযোগ করুন।
              </p>
            </div>
          </div>
          <Link href="/contact" className="w-full md:w-auto">
            <Button className="w-full h-14 px-10 bg-white text-slate-950 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
              Contact Support
            </Button>
          </Link>
        </div>

        {/* Bottom Back To Shop Link */}
        <div className="mt-12 text-center">
          <Link href="/">
            <button className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Shop
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}
