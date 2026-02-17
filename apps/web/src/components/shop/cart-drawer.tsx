'use client';

import { X, Minus, Plus, Trash2, ShoppingBag, Bookmark, ChevronRight, Sparkles, Package, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@bigbazar/shared';
import { useUIStore } from '@/lib/stores/ui-store';

type CouponMessage = {
    type: 'success' | 'error' | 'info';
    text: string;
};

const FREE_SHIPPING_THRESHOLD = 2000;

export function CartDrawer() {
    const {
        items,
        savedItems,
        removeItem,
        updateQuantity,
        getSubtotal,
        clearCart,
        saveForLater,
        moveToCart,
        removeSavedItem,
        applyCoupon,
        removeCoupon,
        getDiscountAmount,
        getShippingCost,
        getTotal,
        getTotalItems,
        couponCode,
    } = useCartStore();

    const isCartOpen = useUIStore((state) => state.isCartOpen);
    const closeCart = useUIStore((state) => state.closeCart);

    const [couponInput, setCouponInput] = useState(couponCode ?? '');
    const [couponMessage, setCouponMessage] = useState<CouponMessage | null>(null);
    const [itemToRemove, setItemToRemove] = useState<string | null>(null);

    useEffect(() => {
        setCouponInput(couponCode ?? '');
    }, [couponCode]);

    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const shippingCost = getShippingCost();
    const total = getTotal();
    const totalItems = getTotalItems();

    const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    const handleApplyCoupon = () => {
        const result = applyCoupon(couponInput);
        setCouponMessage({
            type: result.success ? 'success' : 'error',
            text: result.message,
        });
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponMessage({ type: 'info', text: 'Coupon removed.' });
    };

    const confirmRemove = () => {
        if (itemToRemove) {
            removeItem(itemToRemove);
            setItemToRemove(null);
        }
    };

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
                        className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col font-sans border-l border-gray-100"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-gray-50 bg-white relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Your Curation</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                                        {totalItems} Artifact{totalItems !== 1 ? 's' : ''} Selected
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeCart}
                                className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-gray-100"
                            >
                                <X className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                            </button>
                        </div>

                        {/* Free Shipping Progress */}
                        {items.length > 0 && (
                            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                        <Package className="h-3 w-3" />
                                        {freeShippingProgress < 100
                                            ? `৳${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} to unlock complimentary shipping`
                                            : 'Complimentary Shipping Unlocked'
                                        }
                                    </p>
                                    <span className="text-[10px] font-black text-indigo-600">{Math.round(freeShippingProgress)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${freeShippingProgress}%` }}
                                        className={`h-full rounded-full ${freeShippingProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                            {items.length === 0 && savedItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-8 border border-gray-100 shadow-inner group"
                                    >
                                        <ShoppingBag className="h-12 w-12 text-gray-200 group-hover:text-indigo-400 transition-colors" />
                                    </motion.div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your bag is empty</h3>
                                    <p className="text-gray-400 mb-10 max-w-[280px] leading-relaxed font-medium">
                                        Explore our curated collection and add your favorite pieces to your curation.
                                    </p>
                                    <Button onClick={closeCart} asChild className="rounded-[1.5rem] px-10 h-16 bg-black text-white hover:bg-gray-800 transition-all font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20 group">
                                        <Link href="/shop" className="flex items-center gap-3">
                                            Discover Collection
                                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <AnimatePresence initial={false}>
                                        {items.map((item) => {
                                            const basePrice = item.product?.salePrice || item.product?.basePrice || 0;
                                            const itemPrice = basePrice + (item.variant?.priceAdjustment || 0);

                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="group bg-white p-5 rounded-[2.5rem] border border-gray-100 hover:shadow-xl hover:shadow-black/5 transition-all duration-500 relative overflow-hidden"
                                                >
                                                    <div className="flex gap-6">
                                                        {/* Product Image */}
                                                        <div className="relative w-28 aspect-[3/4] bg-gray-50 rounded-[2rem] overflow-hidden flex-shrink-0 border border-gray-50">
                                                            <Image
                                                                src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                                                                alt={item.product?.name || 'Product'}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                            />
                                                            <button
                                                                onClick={() => setItemToRemove(item.id)}
                                                                className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-2">
                                                            <div className="space-y-1">
                                                                <Link
                                                                    href={`/products/${item.productId}`}
                                                                    className="font-black text-gray-900 text-lg hover:text-indigo-600 transition-colors line-clamp-2 leading-tight tracking-tight"
                                                                    onClick={closeCart}
                                                                >
                                                                    {item.product?.name}
                                                                </Link>
                                                                <div className="flex flex-wrap gap-2 pt-1">
                                                                    {item.variant?.attributes?.size && (
                                                                        <span className="text-[10px] font-black uppercase text-gray-400 border border-gray-100 px-2 py-0.5 rounded-lg">SZ: {item.variant.attributes.size}</span>
                                                                    )}
                                                                    {item.variant?.attributes?.color && (
                                                                        <span className="text-[10px] font-black uppercase text-gray-400 border border-gray-100 px-2 py-0.5 rounded-lg">CLR: {item.variant.attributes.color}</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-end justify-between mt-4">
                                                                {/* Quantity Controls */}
                                                                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black hover:scale-105 transition-all disabled:opacity-30"
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </button>
                                                                    <span className="w-4 text-center font-black text-sm text-gray-900">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black hover:scale-105 transition-all"
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </button>
                                                                </div>

                                                                {/* Price */}
                                                                <div className="text-right">
                                                                    <p className="font-black text-gray-900 text-lg tracking-tighter">
                                                                        {formatPrice(itemPrice * item.quantity)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Removal Confirmation Overlay */}
                                                    <AnimatePresence>
                                                        {itemToRemove === item.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center"
                                                            >
                                                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-3 border border-rose-100">
                                                                    <Trash2 className="h-6 w-6" />
                                                                </div>
                                                                <p className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Discard piece?</p>
                                                                <div className="flex gap-4 w-full">
                                                                    <Button
                                                                        size="lg"
                                                                        variant="destructive"
                                                                        onClick={confirmRemove}
                                                                        className="flex-1 rounded-2xl h-12 text-xs font-black uppercase tracking-widest bg-rose-500 hover:bg-rose-600"
                                                                    >
                                                                        Discard
                                                                    </Button>
                                                                    <Button
                                                                        size="lg"
                                                                        variant="outline"
                                                                        onClick={() => setItemToRemove(null)}
                                                                        className="flex-1 rounded-2xl h-12 text-xs font-black uppercase tracking-widest border-gray-100"
                                                                    >
                                                                        Keep
                                                                    </Button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {savedItems.length > 0 && (
                                        <div className="space-y-6 pt-12 mt-12 border-t border-gray-50">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <Bookmark className="h-3 w-3" />
                                                    Pending Artifacts
                                                </h3>
                                                <span className="text-[10px] font-black px-2 py-0.5 bg-gray-50 rounded-full text-gray-600 tracking-widest">{savedItems.length}</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4">
                                                {savedItems.map((item) => {
                                                    const basePrice = item.product?.salePrice || item.product?.basePrice || 0;
                                                    const itemPrice = basePrice + (item.variant?.priceAdjustment || 0);

                                                    return (
                                                        <div key={item.id} className="group flex gap-5 p-4 bg-gray-50/50 hover:bg-white rounded-[2rem] border border-transparent hover:border-gray-100 transition-all hover:shadow-xl hover:shadow-black/5">
                                                            <div className="relative w-20 aspect-[3/4] bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-gray-50">
                                                                <Image
                                                                    src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                                                                    alt={item.product?.name || 'Product'}
                                                                    fill
                                                                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                                <Link
                                                                    href={`/products/${item.productId}`}
                                                                    className="font-black text-sm text-gray-900 group-hover:text-indigo-600 line-clamp-1 mb-1 transition-colors"
                                                                    onClick={closeCart}
                                                                >
                                                                    {item.product?.name}
                                                                </Link>
                                                                <p className="font-black text-xs text-gray-400 font-mono tracking-tighter mb-4">
                                                                    {formatPrice(itemPrice * item.quantity)}
                                                                </p>
                                                                <div className="flex items-center gap-4">
                                                                    <button
                                                                        onClick={() => moveToCart(item.id)}
                                                                        className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-black transition-colors"
                                                                    >
                                                                        Reinstate
                                                                    </button>
                                                                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                                                                    <button
                                                                        onClick={() => removeSavedItem(item.id)}
                                                                        className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-rose-500 transition-colors"
                                                                    >
                                                                        Discard
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-50 p-8 bg-white space-y-8 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] relative z-10">
                                {/* Coupon Section */}
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                            <Sparkles className="h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Authorization Code / Coupon"
                                            value={couponInput}
                                            onChange={(event) => setCouponInput(event.target.value)}
                                            className="w-full pl-12 pr-24 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-[11px] font-black uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all placeholder:text-gray-300"
                                        />
                                        <div className="absolute right-2 top-2 bottom-2">
                                            {couponCode ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRemoveCoupon}
                                                    className="h-full px-5 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400"
                                                >
                                                    Discard
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleApplyCoupon}
                                                    disabled={!couponInput.trim()}
                                                    className="h-full px-5 hover:bg-black hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 disabled:text-gray-200"
                                                >
                                                    Validate
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {couponMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex items-center gap-2 px-2 ${couponMessage.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}
                                        >
                                            <div className={`w-1 h-1 rounded-full ${couponMessage.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                            <p className="text-[10px] font-black uppercase tracking-widest">{couponMessage.text}</p>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="space-y-4 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Initial Assessment</span>
                                        <span className="text-gray-900 font-mono text-xs">{formatPrice(subtotal)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-emerald-500">Authorized Discount</span>
                                            <span className="text-emerald-500 font-mono text-xs">- {formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Logistics / Courier</span>
                                        <span className={`font-mono text-xs ${shippingCost === 0 ? 'text-indigo-600' : 'text-gray-900'}`}>
                                            {shippingCost === 0 ? 'COMPLIMENTARY' : formatPrice(shippingCost)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-end pt-6 border-t border-gray-200 mt-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Final Authorization</p>
                                            <span className="text-3xl font-black text-gray-900 tracking-tighter font-mono">{formatPrice(total)}</span>
                                        </div>
                                        <div className="mb-1">
                                            <ShieldCheck className="h-6 w-6 text-gray-200" />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-4">
                                    <Button size="lg" className="w-full bg-black hover:bg-gray-800 text-white rounded-[1.5rem] h-20 shadow-2xl shadow-black/20 group font-black tracking-widest uppercase text-sm" asChild>
                                        <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center gap-3">
                                            Proceed to Acquisition <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <div className="flex gap-4">
                                        <Button
                                            variant="ghost"
                                            className="flex-1 rounded-2xl h-14 text-gray-400 hover:text-black hover:bg-gray-50 font-black uppercase tracking-widest text-[10px]"
                                            onClick={closeCart}
                                            asChild
                                        >
                                            <Link href="/cart">Full Review</Link>
                                        </Button>
                                        <div className="w-px h-14 bg-gray-100" />
                                        <Button
                                            variant="ghost"
                                            className="flex-1 rounded-2xl h-14 text-gray-400 hover:text-rose-500 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px]"
                                            onClick={() => { if (confirm('Clear curation?')) clearCart() }}
                                        >
                                            Clear All
                                        </Button>
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
