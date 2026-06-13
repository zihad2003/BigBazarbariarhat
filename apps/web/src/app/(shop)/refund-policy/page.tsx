'use client';

import Link from 'next/link';
import { ArrowLeft, CreditCard, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RefundPolicyPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                
                {/* Header */}
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-neutral-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-neutral-900 tracking-tight">Refund Policy</h1>
                    <p className="text-neutral-400 text-xs mt-3">Last updated: June 2026</p>
                </div>

                <div className="space-y-10 bg-neutral-50 rounded-xl p-8 lg:p-12 border border-neutral-100">
                    
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Refund Eligibility</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Since all deliveries require inspecting items on-the-spot in front of the courier rider, returns are only accepted at the time of delivery. Once the rider leaves, we cannot accept returns or exchanges. Consequently, refunds are applicable only under the following conditions:
                        </p>
                        <ul className="space-y-3 text-sm text-neutral-500 pl-2">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span><strong>Pre-paid Orders Rejected On-The-Spot:</strong> If you paid in advance (via bKash, Nagad, or card) and choose to reject the package in front of the courier rider, you will receive a refund for the product value.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span><strong>Order Cancellation:</strong> If you cancel your order before it has been handed over to the courier service.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span><strong>Manufacturing Defects:</strong> In rare cases where a manufacturing defect is discovered after the rider leaves, you must contact customer care within 48 hours of delivery with photographic/video proof.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <CreditCard className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Refund Methods & Channels</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Approved refunds will be processed through the original channel used for payment:
                        </p>
                        <ul className="space-y-3 text-sm text-neutral-500 pl-2">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span><strong>Mobile Banking (bKash/Nagad):</strong> Refunds are sent directly to the original billing number.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span><strong>Online Payments (Debit/Credit Card):</strong> Refunds are processed back to the originating bank account or card.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span><strong>Cash on Delivery (Defects):</strong> If a post-delivery manufacturing defect is validated, we will refund you via bKash or Nagad.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <Clock className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Processing Time</h2>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                            Once your refund request is approved and the returned item is received back at our warehouse:
                        </p>
                        <ul className="space-y-3 text-sm text-neutral-500 pl-2">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span>Mobile wallets (bKash/Nagad) take <strong>3 to 5 business days</strong> to reflect in your account.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span>Card payments or bank transfers take <strong>7 to 10 business days</strong> depending on your bank's processing cycles.</span>
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                                <AlertTriangle className="h-4 w-4" />
                            </div>
                            <h2 className="text-base font-bold text-neutral-900">Non-Refundable Charges</h2>
                        </div>
                        <ul className="space-y-3 text-sm text-neutral-500 pl-2">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span><strong>Delivery Charges:</strong> Shipping fees paid to courier partners are strictly non-refundable once dispatch is initiated.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full mt-2 shrink-0" />
                                <span><strong>Items Damaged Post-Delivery:</strong> Any clothing or decor items that show signs of damage, wear, or washing after acceptance cannot be refunded.</span>
                            </li>
                        </ul>
                    </section>

                    <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                            Questions about your refund?
                        </p>
                        <Link href="/contact">
                            <Button variant="outline" className="rounded-xl h-11 px-8 text-[10px] font-black uppercase tracking-widest border-neutral-200">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
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
