'use client';
import React from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/use-cart';

export default function CartPage() {
    const cart = useCart();

    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const subtotal = cart.getSubtotal();
    const shippingEstimate = 120; // Static for now, can be dynamic
    const total = subtotal + shippingEstimate;

    if (!isMounted) return null;

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag className="h-12 w-12 text-gray-300" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 text-center">Your Bag is Empty</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8 text-center max-w-sm leading-relaxed">
                    Looks like you haven&apos;t added any exclusive items to your cart yet.
                </p>
                <Link href="/">
                    <Button className="h-16 px-10 bg-black text-white rounded-full text-xs font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-black/20">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic mb-12">Shopping Bag <span className="text-gray-300 text-3xl not-italic ml-2">({cart.items.length > 0 ? cart.getTotalItems() : 0})</span></h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {cart.items.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 flex gap-6 sm:gap-8 group hover:shadow-xl hover:shadow-indigo-900/5 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[8rem] opacity-0 group-hover:opacity-50 transition-all" />

                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-[1.5rem] flex-shrink-0 overflow-hidden relative border border-gray-100">
                                    {item.product.images?.[0] ? (
                                        <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-black">IMG</div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-2 relative z-10">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight line-clamp-1">{item.product.name}</h3>
                                            <button
                                                onClick={() => cart.removeItem(item.id)}
                                                className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                            {item.variant ? `${item.variant.name}` : `SKU: ${item.product.sku}`}
                                        </p>
                                    </div>

                                    <div className="flex items-end justify-between mt-4">
                                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1 border border-gray-100">
                                            <button
                                                onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-4 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <p className="text-xl font-black text-gray-900 tracking-tighter">
                                            ৳{(item.variant?.priceAdjustment
                                                ? (item.product.salePrice ?? item.product.basePrice) + item.variant.priceAdjustment
                                                : (item.product.salePrice ?? item.product.basePrice)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:sticky lg:top-12 h-fit space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-full opacity-50 -z-10" />

                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-8">Order Summary</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">৳{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>Shipping Estimate</span>
                                    <span className="text-gray-900">৳{shippingEstimate.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-end pt-6 border-t border-gray-100 mt-6">
                                    <span className="text-base font-black text-gray-900 uppercase tracking-widest">Total</span>
                                    <span className="text-4xl font-black text-gray-900 tracking-tighter">৳{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <Button className="w-full mt-10 h-20 bg-black text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                                    Proceed to Checkout
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <div className="mt-8 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                    Taxes and shipping calculated at checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
