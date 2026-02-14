'use client';

import { X, Minus, Plus, Trash2, ShoppingBag, Bookmark } from 'lucide-react';
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

    const { isCartOpen, closeCart } = useUIStore((state) => ({
        isCartOpen: state.isCartOpen,
        closeCart: state.closeCart,
    }));

    const [couponInput, setCouponInput] = useState(couponCode ?? '');
    const [couponMessage, setCouponMessage] = useState<CouponMessage | null>(null);

    useEffect(() => {
        setCouponInput(couponCode ?? '');
    }, [couponCode]);

    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const shippingCost = getShippingCost();
    const total = getTotal();
    const totalItems = getTotalItems();

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
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-6 w-6" />
                                <h2 className="text-xl font-bold">Your Cart</h2>
                                <span className="px-2 py-1 bg-gray-100 rounded-full text-sm font-semibold">
                                    {totalItems} items
                                </span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 && savedItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                                    <p className="text-gray-500 mb-6">
                                        Looks like you haven't added anything to your cart yet.
                                    </p>
                                    <Button onClick={closeCart} asChild>
                                        <Link href="/shop">Start Shopping</Link>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {items.length > 0 && (
                                        <div className="space-y-4">
                                            {items.map((item) => {
                                                const basePrice = item.product?.salePrice || item.product?.basePrice || 0;
                                                const itemPrice = basePrice + (item.variant?.priceAdjustment || 0);

                                                return (
                                                    <motion.div
                                                        key={item.id}
                                                        layout
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -100 }}
                                                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                                                    >
                                                        {/* Product Image */}
                                                        <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                                                                alt={item.product?.name || 'Product'}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <Link
                                                                href={`/products/${item.productId}`}
                                                                className="font-semibold text-sm hover:text-gray-600 line-clamp-2"
                                                                onClick={closeCart}
                                                            >
                                                                {item.product?.name}
                                                            </Link>

                                                            {item.variant && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {item.variant.size && `Size: ${item.variant.size}`}
                                                                    {item.variant.size && item.variant.color && ' | '}
                                                                    {item.variant.color && `Color: ${item.variant.color}`}
                                                                </p>
                                                            )}

                                                            <button
                                                                onClick={() => saveForLater(item.id)}
                                                                className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                                                            >
                                                                <Bookmark className="h-3.5 w-3.5" />
                                                                Save for later
                                                            </button>

                                                            <div className="flex items-center justify-between mt-3">
                                                                {/* Quantity Controls */}
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full border hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </button>
                                                                    <span className="w-8 text-center font-semibold text-sm">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full border hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </button>
                                                                </div>

                                                                {/* Price */}
                                                                <div className="text-right">
                                                                    <p className="font-bold text-sm">
                                                                        {formatPrice(itemPrice * item.quantity)}
                                                                    </p>
                                                                    {item.quantity > 1 && (
                                                                        <p className="text-xs text-gray-500">
                                                                            {formatPrice(itemPrice)} each
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors self-start"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {savedItems.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-gray-700">Saved for later</h3>
                                                <span className="text-xs text-gray-500">{savedItems.length} items</span>
                                            </div>
                                            {savedItems.map((item) => {
                                                const basePrice = item.product?.salePrice || item.product?.basePrice || 0;
                                                const itemPrice = basePrice + (item.variant?.priceAdjustment || 0);

                                                return (
                                                    <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                                                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={item.product?.images?.[0]?.url || '/placeholder.jpg'}
                                                                alt={item.product?.name || 'Product'}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <Link
                                                                href={`/products/${item.productId}`}
                                                                className="font-semibold text-sm hover:text-gray-600 line-clamp-1"
                                                                onClick={closeCart}
                                                            >
                                                                {item.product?.name}
                                                            </Link>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {item.variant?.name || 'Standard'}
                                                            </p>
                                                            <p className="font-semibold text-sm mt-2">
                                                                {formatPrice(itemPrice * item.quantity)}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => moveToCart(item.id)}
                                                                    className="h-8"
                                                                >
                                                                    Move to cart
                                                                </Button>
                                                                <button
                                                                    onClick={() => removeSavedItem(item.id)}
                                                                    className="text-xs text-gray-500 hover:text-red-500"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t p-6 space-y-4">
                                {/* Coupon Input */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Coupon code"
                                            value={couponInput}
                                            onChange={(event) => setCouponInput(event.target.value)}
                                            className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                        />
                                        {couponCode ? (
                                            <Button variant="outline" size="sm" onClick={handleRemoveCoupon}>
                                                Remove
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleApplyCoupon}
                                                disabled={!couponInput.trim()}
                                            >
                                                Apply
                                            </Button>
                                        )}
                                    </div>
                                    {couponMessage && (
                                        <p
                                            className={`text-xs ${
                                                couponMessage.type === 'error'
                                                    ? 'text-red-500'
                                                    : couponMessage.type === 'success'
                                                        ? 'text-green-600'
                                                        : 'text-gray-500'
                                            }`}
                                        >
                                            {couponMessage.text}
                                        </p>
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">{formatPrice(subtotal)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="font-semibold text-green-600">- {formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                                            {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                                        </span>
                                    </div>
                                    {subtotal < FREE_SHIPPING_THRESHOLD && (
                                        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                            Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping!
                                        </p>
                                    )}
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid gap-2">
                                    <Button size="lg" className="w-full" asChild>
                                        <Link href="/checkout" onClick={closeCart}>
                                            Checkout
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full"
                                        onClick={closeCart}
                                        asChild
                                    >
                                        <Link href="/cart">
                                            View Cart
                                        </Link>
                                    </Button>
                                </div>

                                {/* Clear Cart */}
                                <button
                                    onClick={clearCart}
                                    className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
