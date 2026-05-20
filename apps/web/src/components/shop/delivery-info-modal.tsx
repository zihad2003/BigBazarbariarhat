'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Truck, MapPin, Clock, CreditCard, AlertCircle, ShoppingBag, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DeliveryInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
}

export function DeliveryInfoModal({ isOpen, onClose, productName }: DeliveryInfoModalProps) {
    const whatsappNumber = '01857045449';
    const whatsappMessage = productName
        ? encodeURIComponent(`Hi, I want to order: ${productName}`)
        : encodeURIComponent('Hi, I want to order from Big Bazar');

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-y-auto bg-white border-l border-slate-100 flex flex-col text-slate-900">
                <div className="flex-1">
                    {/* Header with Luxury feel */}
                    <div className="relative h-48 bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                        <div className="absolute inset-0 bg-indigo-600/5" />
                        {/* Decorative elements */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10 text-center">
                            <Truck className="h-12 w-12 text-slate-900 mx-auto mb-4 animate-bounce" />
                            <h2 className="text-3xl font-playfair font-black uppercase tracking-tighter text-slate-900">
                                ডেলিভারি সংক্রান্ত তথ্য
                            </h2>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mt-2">
                                Delivery Information
                            </p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Delivery Areas */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-900">
                                <MapPin className="h-4 w-4" />
                                ডেলিভারি চার্জ (Delivery Charges)
                            </h3>
                            <div className="grid gap-4">
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="p-5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-100 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl">
                                            🎁
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">মীরসরাইয়ের মধ্যে</p>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest">Local Mirsarai</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">ফ্রি ডেলিভারি</span>
                                </motion.div>

                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="p-5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-100 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl">
                                            📦
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">চট্টগ্রাম জেলার মধ্যে</p>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest">Chittagong District</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">৳১০০</span>
                                </motion.div>

                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="p-5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-100 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl">
                                            📮
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">চট্টগ্রামের বাইরে (বাংলাদেশ)</p>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest">Outside Chittagong</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">৳১৫০+</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Delivery Time & Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 shadow-sm">
                                <div className="flex items-center gap-2 text-slate-900">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">ডেলিভারি সময়</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">অর্ডার কনফার্ম করার সাধারণত ৩–৪ দিনের মধ্যে।</p>
                            </div>
                            <div className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 shadow-sm">
                                <div className="flex items-center gap-2 text-slate-900">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">শপ ঠিকানা</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">বারইয়াহাট, মীরসরাই, চট্টগ্রাম</p>
                            </div>
                        </div>

                        {/* Payment & Important Notes */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-rose-600">
                                <AlertCircle className="h-4 w-4" />
                                গুরুত্বপূর্ণ নোট (Important Notes)
                            </h3>
                             <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100 space-y-6">
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4">
                                        <div className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0 shadow-lg shadow-rose-500/50" />
                                        <p className="text-sm text-rose-900 leading-relaxed">ডেলিভারি চার্জ অর্ডার কনফার্ম করার সময় অ্যাডভান্সে পরিশোধ করতে হবে।</p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                                        <p className="text-sm text-rose-900 leading-relaxed font-bold">পেমেন্ট করতে হবে bKash (Personal) নাম্বারে: <span className="text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-rose-200">{whatsappNumber}</span></p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                                        <p className="text-sm text-rose-700 leading-relaxed font-bold">অনুগ্রহ করে Send Money অপশন ব্যবহার করে পেমেন্ট করবেন।</p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="h-2 w-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                                        <p className="text-sm text-rose-900 leading-relaxed font-bold">
                                            <span className="text-rose-600">রিটার্ন পলিসি:</span> রাইডার পৌঁছানোর পর পণ্য চেক করে তাৎক্ষণিকভাবে ফেরত দিতে পারবেন। এই ক্ষেত্রে কাস্টমারকে শুধুমাত্র ডেলিভারি চার্জটি পরিশোধ করতে হবে। পরবর্তীতে কোনো রিটার্ন গ্রহণযোগ্য নয়।
                                        </p>
                                    </li>
                                </ul>

                                <div className="pt-4 border-t border-rose-200">
                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">⚠️ সতর্কবার্তা ও রিটার্ন:</p>
                                    <p className="text-xs text-rose-800 mt-1 italic font-medium leading-relaxed">ভুল করে Recharge করলে সেই টাকা ফেরত দেওয়া সম্ভব নয়। রাইডার চলে যাওয়ার পর কোনো রিটার্ন গ্রহণযোগ্য নয়।</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 space-y-4">
                            <Button
                                className="w-full h-16 bg-[#25D366] text-white hover:bg-[#128C7E] rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 border-0 transition-all active:scale-95"
                                onClick={() => window.open(whatsappLink, '_blank')}
                            >
                                <MessageSquare className="h-5 w-5" />
                                <span className="font-black uppercase tracking-widest text-xs">অর্ডার করতে হোয়াটসঅ্যাপ করুন</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                onClick={onClose}
                            >
                                <span className="font-black uppercase tracking-widest text-[10px]">বন্ধ করুন (Close)</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Protection */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Big Bazar © 2026
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}

