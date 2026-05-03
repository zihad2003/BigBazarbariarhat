'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
    Trash2, 
    Plus, 
    Minus, 
    ShoppingBag, 
    ArrowRight, 
    Bookmark, 
    ChevronLeft, 
    AlertCircle, 
    Sparkles, 
    ShieldCheck,
    RotateCcw,
    Truck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatPrice, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
    const router = useRouter()
    const {
        items,
        savedItems,
        updateQuantity,
        removeItem,
        saveForLater,
        moveToCart,
        removeSavedItem,
        applyCoupon,
        removeCoupon,
        couponCode,
        getSubtotal,
        getDiscountAmount,
        getShippingCost,
        getTotal,
        getItemCount
    } = useCartStore()

    const [isMounted, setIsMounted] = useState(false)
    const [couponInput, setCouponInput] = useState(couponCode || '')
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [itemToRemove, setItemToRemove] = useState<string | null>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        setCouponInput(couponCode || '')
    }, [couponCode])

    if (!isMounted) return null

    const subtotal = getSubtotal()
    const discount = getDiscountAmount()
    const shipping = getShippingCost()
    const total = getTotal()
    const itemCount = getItemCount()

    const handleApplyCoupon = () => {
        const result = applyCoupon(couponInput)
        setCouponMessage({
            type: result.success ? 'success' : 'error',
            text: result.message
        })
    }

    if (items.length === 0 && savedItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-28 h-28 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 border border-gray-100"
                >
                    <ShoppingBag className="h-12 w-12 text-gray-200" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 font-playfair">Your Cart is Empty</h1>
                <p className="text-gray-400 mb-10 max-w-sm leading-relaxed">
                    You haven't added anything to your cart yet. Browse our collection and find something you love.
                </p>
                <Link href="/products">
                    <Button className="rounded-xl px-10 h-14 bg-foreground text-white hover:bg-primary transition-all font-bold text-sm uppercase tracking-wider group">
                        Start Shopping <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-playfair">Your Shopping Cart</h1>
                        <p className="text-sm text-gray-400 mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
                    </div>
                    <Link href="/products" className="text-sm font-semibold text-gray-500 hover:text-foreground transition-all flex items-center gap-2">
                        <ChevronLeft className="h-4 w-4" /> Continue Shopping
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Left: Cart Items List */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Active Items Section */}
                        {items.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Items in Cart</h2>
                                <div className="space-y-4">
                                    <AnimatePresence initial={false}>
                                        {items.map((item) => {
                                            const itemPrice = item.product.salePrice || item.product.basePrice;
                                            const totalPrice = (itemPrice + (item.variant?.priceAdjustment || 0)) * item.quantity;
                                            const isLowStock = item.product.stockQuantity < item.quantity;

                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    className="group relative flex flex-col sm:flex-row gap-6 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
                                                >
                                                    {/* Remove Confirmation Overlay */}
                                                    {itemToRemove === item.id && (
                                                        <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 rounded-2xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                                                            <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-4 border border-rose-100">
                                                                <Trash2 className="h-7 w-7" />
                                                            </div>
                                                            <p className="text-sm font-semibold text-gray-900 mb-6">Remove this item from your cart?</p>
                                                            <div className="flex gap-3 w-full max-w-xs">
                                                                <Button
                                                                    onClick={() => { removeItem(item.id); setItemToRemove(null); }}
                                                                    className="flex-1 rounded-xl h-11 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm"
                                                                >
                                                                    Remove
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => setItemToRemove(null)}
                                                                    className="flex-1 rounded-xl h-11 border-gray-200 font-bold text-sm"
                                                                >
                                                                    Keep
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Product Image */}
                                                    <div className="relative w-full sm:w-32 aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 group-hover:shadow-md transition-all duration-300">
                                                        <Image
                                                            src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                                                            alt={item.product.name}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                        />
                                                    </div>

                                                    {/* Details & Controls */}
                                                    <div className="flex-1 flex flex-col justify-between py-2">
                                                        <div>
                                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                                <div className="space-y-1">
                                                                    <Link href={`/products/${item.product.slug}`} className="text-lg font-bold text-gray-900 hover:text-primary transition-colors leading-snug">
                                                                        {item.product.name}
                                                                    </Link>
                                                                    <div className="flex flex-wrap gap-2 pt-1.5">
                                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">SKU: {item.product.sku}</span>
                                                                        {item.variant && (
                                                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-green-50 px-2 py-0.5 rounded-md">
                                                                                {item.variant.name}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-1">
                                                                    <span className="text-lg font-bold text-gray-900">
                                                                        {formatPrice(totalPrice)}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">
                                                                        {formatPrice(itemPrice + (item.variant?.priceAdjustment || 0))} each
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {isLowStock && (
                                                                <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-2 rounded-xl w-fit mb-6">
                                                                    <AlertCircle className="h-4 w-4" />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest">Insufficient Stock (Available: {item.product.stockQuantity})</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap items-center justify-between gap-6 mt-auto">
                                                            {/* Quantity Control */}
                                                            <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-1.5 border border-gray-50">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-all border border-gray-100 disabled:opacity-30"
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </button>
                                                                <span className="w-6 text-center font-black text-lg text-gray-900 font-mono">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-all border border-gray-100"
                                                                >
                                                                    <Plus className="h-4 w-4" />
                                                                </button>
                                                            </div>

                                                            {/* Secondary Actions */}
                                                            <div className="flex items-center gap-6">
                                                                <button
                                                                    onClick={() => saveForLater(item.id)}
                                                                    className="text-xs font-semibold text-gray-400 hover:text-primary transition-all flex items-center gap-1.5 group/btn"
                                                                >
                                                                    <Bookmark className="h-3.5 w-3.5 group-hover/btn:fill-current" />
                                                                    Save for Later
                                                                </button>
                                                                <div className="w-px h-4 bg-gray-200" />
                                                                <button
                                                                    onClick={() => setItemToRemove(item.id)}
                                                                    className="text-xs font-semibold text-gray-400 hover:text-rose-500 transition-all flex items-center gap-1.5"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {/* Saved Items Section */}
                        {savedItems.length > 0 && (
                            <div className="pt-10 border-t border-gray-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Bookmark className="h-4 w-4" /> Saved for Later
                                    </h2>
                                    <span className="px-3 py-1 bg-gray-50 rounded-full text-xs font-semibold text-gray-400">{savedItems.length} items</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedItems.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group">
                                            <div className="relative w-20 aspect-[3/4] bg-white rounded-lg overflow-hidden flex-shrink-0 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                                                <Image
                                                    src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1 text-sm">{item.product.name}</h3>
                                                <p className="text-sm font-bold text-gray-700 mb-3">{formatPrice(item.product.salePrice || item.product.basePrice)}</p>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => moveToCart(item.id)}
                                                        className="text-xs font-semibold text-primary hover:text-foreground transition-all"
                                                    >
                                                        Move to Cart
                                                    </button>
                                                    <button
                                                        onClick={() => removeSavedItem(item.id)}
                                                        className="text-xs font-semibold text-gray-300 hover:text-rose-500 transition-all"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Order Summary Module */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            
                            {/* Summary Card */}
                            <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100 shadow-sm">
                                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-7">Order Summary</h2>

                                {/* Coupon Section */}
                                <div className="space-y-3 mb-7">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Sparkles className="h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            className="w-full pl-11 pr-24 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300 shadow-sm"
                                        />
                                        <div className="absolute right-2 top-2 bottom-2">
                                            {couponCode ? (
                                                <Button
                                                    variant="ghost"
                                                    onClick={removeCoupon}
                                                    className="h-full px-4 hover:bg-rose-50 hover:text-rose-500 rounded-lg text-xs font-semibold text-gray-400"
                                                >
                                                    Remove
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    onClick={handleApplyCoupon}
                                                    disabled={!couponInput.trim()}
                                                    className="h-full px-4 hover:bg-primary hover:text-white rounded-lg text-xs font-semibold text-primary disabled:text-gray-300 transition-all"
                                                >
                                                    Apply
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {couponMessage && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className={cn("text-xs font-semibold px-1", couponMessage.type === 'error' ? 'text-rose-500' : 'text-emerald-600')}>
                                            {couponMessage.text}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-4 pt-6 border-t border-gray-200">
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-sm text-emerald-600">
                                            <span>Discount</span>
                                            <span className="font-semibold">− {formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>Shipping</span>
                                        <span className={cn("font-semibold", shipping === 0 ? 'text-primary' : 'text-gray-800')}>
                                            {shipping === 0 ? 'Free' : formatPrice(shipping)}
                                        </span>
                                    </div>

                                    {subtotal > 0 && subtotal < 1000 && (
                                        <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                                            <p className="text-xs font-medium text-primary text-center">
                                                Add {formatPrice(1000 - subtotal)} more for free shipping!
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-5 border-t border-gray-200">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Total</p>
                                            <span className="text-3xl font-bold text-gray-900">{formatPrice(total)}</span>
                                        </div>
                                        <ShieldCheck className="h-7 w-7 text-gray-200" />
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <div className="mt-7 space-y-3">
                                    <Button
                                        onClick={() => router.push('/checkout')}
                                        disabled={items.length === 0}
                                        className="w-full h-14 bg-foreground text-white hover:bg-primary rounded-xl text-sm font-bold uppercase tracking-wider gap-2 transition-all group"
                                    >
                                        Proceed to Checkout <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Secure & encrypted checkout
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-emerald-500">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Fast Delivery</h4>
                                        <p className="text-[11px] text-gray-400">Nationwide delivery available</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                                        <RotateCcw className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">Easy Returns</h4>
                                        <p className="text-[11px] text-gray-400">30-day return policy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
