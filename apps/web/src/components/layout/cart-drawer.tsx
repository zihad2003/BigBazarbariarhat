'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
    const { isCartOpen, setCartOpen } = useUIStore();
    const { items, removeItem, updateQuantity, getSubtotal, getTotal, getItemCount } = useCartStore();
    const subtotal = getSubtotal();
    const total = getTotal();
    const itemCount = getItemCount();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-zoom-out"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tighter">Curation Matrix</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{itemCount} Artifacts Synchronized</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setCartOpen(false)}
                                className="p-3 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-slate-100 shadow-sm"
                            >
                                <X className="h-5 w-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="relative w-24 aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                                    <button 
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.variant || 'Standard Manifest'}</p>
                                            </div>
                                            
                                            <div className="flex items-end justify-between mt-4">
                                                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 p-1">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-black font-mono">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <p className="text-lg font-black text-slate-900 font-mono tracking-tighter">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                                    <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-8">
                                        <ShoppingBag className="h-10 w-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Matrix Empty</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2">Begin your acquisition protocol.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <span>Initial Subtotal</span>
                                        <span className="text-slate-900 font-mono">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <span>Logistics Transit</span>
                                        <span className="text-emerald-500 font-mono">AUTHORIZED FREE</span>
                                    </div>
                                    <div className="pt-4 border-t border-dashed border-slate-200">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Final Authorization</p>
                                            <h4 className="text-3xl font-black text-slate-900 tracking-tighter font-mono">{formatPrice(total)}</h4>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/cart" onClick={() => setCartOpen(false)}>
                                        <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-200 text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                            Review Curation
                                        </Button>
                                    </Link>
                                    <Link href="/checkout" onClick={() => setCartOpen(false)}>
                                        <Button className="w-full h-16 rounded-2xl bg-black text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-black/10 flex items-center gap-3">
                                            Execute <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
