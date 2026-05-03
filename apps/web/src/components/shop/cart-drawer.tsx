'use client';

import { X, Minus, Plus, Trash2, ShoppingBag, Bookmark, ChevronRight, Package, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/lib/stores/ui-store';

export function CartDrawer() {
    const {
        items,
        savedItems,
        removeItem,
        updateQuantity,
        moveToCart,
        removeSavedItem,
        getSubtotal,
        getDiscountAmount,
        getShippingCost,
        getTotal,
        getItemCount,
    } = useCartStore();

    const isCartOpen = useUIStore((state) => state.isCartOpen);
    const closeCart = useUIStore((state) => state.closeCart);

    const [itemToRemove, setItemToRemove] = useState<string | null>(null);

    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const shippingCost = getShippingCost();
    const total = getTotal();
    const itemCount = getItemCount();

    const FREE_SHIPPING_THRESHOLD = 1000;
    const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 px-4"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 w-full h-full bg-white shadow-2xl z-50 flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="border-b border-gray-50 bg-white relative z-10">
                            <div className="max-w-4xl mx-auto w-full flex items-baseline justify-between p-8 md:p-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Your cart</h2>
                                <button
                                    onClick={closeCart}
                                    className="text-sm font-medium text-gray-400 hover:text-black transition-colors flex items-center gap-2 group"
                                >
                                    Close <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* Free Shipping Progress (Twelve Style) */}
                        {items.length > 0 && freeShippingProgress < 100 && (
                            <div className="bg-white border-b border-gray-50">
                                <div className="max-w-4xl mx-auto w-full px-8 py-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-center">
                                        Add ৳{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} more for complimentary shipping
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Table Headers (Desktop) */}
                        <div className="hidden md:grid max-w-4xl mx-auto w-full grid-cols-12 gap-8 mt-10 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-8">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-3 text-center">Quantity</div>
                            <div className="col-span-3 text-right">Total</div>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <div className="max-w-4xl mx-auto w-full p-8 md:p-12 pt-0 space-y-10">
                                {items.length === 0 && savedItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-32">
                                        <ShoppingBag className="h-12 w-12 text-gray-100 mb-6" />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Your cart is empty</h3>
                                        <Link href="/products" onClick={closeCart} className="text-sm font-medium text-gray-400 underline underline-offset-4 hover:text-black transition-colors">
                                            Continue shopping
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <AnimatePresence initial={false}>
                                            {items.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-8 border-b border-gray-50 last:border-0 relative group"
                                                >
                                                    {/* Product Info */}
                                                    <div className="col-span-1 md:col-span-6 flex gap-6 md:gap-10">
                                                        <div className="relative w-20 md:w-28 aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item.image || '/placeholder.jpg'}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <div className="absolute top-0 left-0 bg-rose-500 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-wider">
                                                                New
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col justify-center space-y-1.5">
                                                            <Link href={`/products/${item.productId}`} onClick={closeCart} className="text-sm md:text-base font-bold text-gray-900 hover:opacity-70 transition-opacity">
                                                                {item.name}
                                                            </Link>
                                                            <p className="text-sm text-gray-500 font-medium">Tk{item.price.toLocaleString()}.00</p>
                                                            {item.variant && (
                                                                <div className="space-y-0.5 pt-2">
                                                                    {item.variant.split('/').map((v, i) => {
                                                                        const [key, val] = v.includes(':') ? v.split(':') : [i === 0 ? 'Size' : 'Color', v];
                                                                        return (
                                                                            <p key={i} className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                                                                {key.trim()}: {val.trim()}
                                                                            </p>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Quantity Control */}
                                                    <div className="col-span-1 md:col-span-3 flex items-center justify-center gap-4">
                                                        <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden scale-90 md:scale-100">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="w-9 text-center text-xs font-medium text-gray-900 border-x border-gray-200 py-2">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-2 text-gray-300 hover:text-black transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    {/* Item Total */}
                                                    <div className="col-span-1 md:col-span-3 text-right">
                                                        <p className="text-sm md:text-base font-medium text-gray-900">
                                                            Tk{(item.price * item.quantity).toLocaleString()}.00
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer / Summary Section */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-100 bg-white">
                                <div className="max-w-4xl mx-auto w-full p-8 md:p-12 flex flex-col items-end">
                                    <div className="flex flex-col items-end space-y-4 max-w-sm w-full">
                                        <div className="flex items-baseline gap-6 mb-2">
                                            <span className="text-base font-bold text-gray-900 uppercase tracking-tight">Estimated total</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-bold text-gray-900">Tk{total.toLocaleString()}.00</span>
                                                <span className="text-xs font-bold text-gray-500">BDT</span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-[10px] text-gray-400 text-right leading-relaxed font-medium uppercase tracking-[0.1em]">
                                            Taxes, discounts and <Link href="/cart" onClick={closeCart} className="underline underline-offset-2 hover:text-black transition-colors">shipping</Link> calculated at checkout.
                                        </p>

                                        <div className="pt-6 w-full space-y-3">
                                            <Button
                                                onClick={() => { closeCart(); router.push('/checkout'); }}
                                                className="w-full h-14 bg-black text-white hover:bg-gray-900 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-all"
                                            >
                                                Check out
                                            </Button>
                                            <Link href="/cart" onClick={closeCart} className="block text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors py-2">
                                                View full cart details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
