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

interface DeliveryInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
}

export function DeliveryInfoModal({ isOpen, onClose, productName }: DeliveryInfoModalProps) {
    const whatsappNumber = '01877765535';
    const whatsappMessage = productName
        ? encodeURIComponent(`Hi, I want to order: ${productName}`)
        : encodeURIComponent('Hi, I want to order from Big Bazar');

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-y-auto bg-background border-l border-border flex flex-col text-foreground">
                <div className="flex-1">
                    {/* Header with Luxury feel */}
                    <div className="relative h-48 bg-luxury-gradient flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-luxury-gold/5" />
                        {/* Decorative elements */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-luxury-gold/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-luxury-red/10 rounded-full blur-3xl" />

                        <div className="relative z-10 text-center">
                            <Truck className="h-12 w-12 text-luxury-gold mx-auto mb-4 animate-bounce" />
                            <h2 className="text-3xl font-playfair font-black uppercase tracking-tighter text-gradient-gold">
                                ডেলিভারি সংক্রান্ত তথ্য
                            </h2>
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mt-2">
                                Delivery Protocol & Logistics
                            </p>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Delivery Areas */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-luxury-gold">
                                <MapPin className="h-4 w-4" />
                                ডেলিভারি চার্জ (Delivery Charges)
                            </h3>
                            <div className="grid gap-4">
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="p-5 bg-card rounded-2xl border border-border flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                                            🎁
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">মীরসরাইয়ের মধ্যে</p>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Local Mirsarai</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-lg">ফ্রি ডেলিভারি</span>
                                </motion.div>

                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="p-5 bg-card rounded-2xl border border-border flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                                            📦
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">চট্টগ্রাম জেলার মধ্যে</p>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest">Chittagong District</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-luxury-gold uppercase tracking-widest">৳১০০</span>
                                </motion.div>

                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="p-5 bg-card rounded-2xl border border-border flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                                            📮
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">চট্টগ্রামের বাইরে (বাংলাদেশ)</p>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest">Outside Chittagong</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-luxury-gold uppercase tracking-widest">৳১৫০+</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Delivery Time & Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-card rounded-2xl border border-border space-y-3">
                                <div className="flex items-center gap-2 text-luxury-gold">
                                    <Clock className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">ডেলিভারি সময়</span>
                                </div>
                                <p className="text-sm font-bold leading-relaxed">অর্ডার কনফার্ম করার সাধারণত ৩–৪ দিনের মধ্যে।</p>
                            </div>
                            <div className="p-5 bg-card rounded-2xl border border-border space-y-3">
                                <div className="flex items-center gap-2 text-luxury-gold">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">শপ ঠিকানা</span>
                                </div>
                                <p className="text-sm font-bold leading-relaxed">বারইয়াহাট, মীরসরাই, চট্টগ্রাম</p>
                            </div>
                        </div>

                        {/* Payment & Important Notes */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-luxury-red">
                                <AlertCircle className="h-4 w-4" />
                                গুরুত্বপূর্ণ নোট (Important Notes)
                            </h3>
                            <div className="p-6 bg-red-500/5 rounded-[2rem] border border-luxury-red/10 space-y-6">
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4">
                                        <div className="h-2 w-2 rounded-full bg-luxury-red mt-2 shrink-0 shadow-lg shadow-luxury-red/50" />
                                        <p className="text-sm text-muted-foreground leading-relaxed">ডেলিভারি চার্জ অর্ডার কনফার্ম করার সময় অ্যাডভান্সে পরিশোধ করতে হবে।</p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="h-2 w-2 rounded-full bg-luxury-red mt-2 shrink-0" />
                                        <p className="text-sm text-muted-foreground leading-relaxed font-bold">পেমেন্ট করতে হবে bKash (Personal) নাম্বারে: <span className="text-foreground font-mono bg-muted px-2 py-0.5 rounded border border-border">{whatsappNumber}</span></p>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="h-2 w-2 rounded-full bg-luxury-red mt-2 shrink-0" />
                                        <p className="text-sm text-gray-300 leading-relaxed font-bold text-luxury-gold">অনুগ্রহ করে Send Money অপশন ব্যবহার করে পেমেন্ট করবেন।</p>
                                    </li>
                                </ul>

                                <div className="pt-4 border-t border-white/5">
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">⚠️ সতর্কবার্তা:</p>
                                    <p className="text-xs text-gray-400 mt-1 italic font-medium">ভুল করে Recharge করলে সেই টাকা ফেরত দেওয়া সম্ভব নয়। পণ্যের ওজন অনুযায়ী চার্জ বাড়তে পারে।</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 space-y-4">
                            <Button
                                className="w-full h-16 bg-[#25D366] text-white hover:bg-[#128C7E] rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 border-0 transition-all active:scale-95"
                                onClick={() => window.open(whatsappLink, '_blank')}
                            >
                                <MessageSquare className="h-5 w-5" />
                                <span className="font-black uppercase tracking-widest text-xs">অর্ডার করতে হোয়াটসঅ্যাপ করুন</span>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-white/10 text-gray-400 hover:text-white hover:border-luxury-gold"
                                onClick={onClose}
                            >
                                <span className="font-black uppercase tracking-widest text-[10px]">বন্ধ করুন (Close Protocol)</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Protection */}
                <div className="p-6 bg-card border-t border-border text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        Official Curation / Big Bazar © 2026
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
