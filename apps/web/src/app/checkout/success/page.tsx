'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl shadow-indigo-100 border border-gray-100">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Order Confirmed!</h1>
                <p className="text-gray-500 font-medium leading-relaxed mb-6">
                    Thank you for your purchase. Your order has been placed successfully and is being processed.
                </p>

                {orderId && (
                    <div className="bg-gray-50 rounded-2xl py-4 mb-8">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Transaction ID</p>
                        <p className="text-xl font-black text-gray-900 font-mono tracking-tighter">#{orderId.slice(-8).toUpperCase()}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <Link href="/account/orders">
                        <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-gray-100 hover:border-black font-black uppercase tracking-widest text-xs">
                            Track Order Status
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/20 hover:scale-105 transition-all gap-2 flex items-center justify-center">
                            Continue Shopping
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
