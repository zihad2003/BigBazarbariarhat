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
import { useLanguageStore } from '@bigbazar/shared'

export default function CartPage() {
    const { language } = useLanguageStore()
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
        <div className="bg-white min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
                
                {/* Header Section */}
                <div className="flex justify-between items-baseline border-b border-gray-100 pb-8 mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Your Cart</h1>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{itemCount} Item{itemCount !== 1 ? 's' : ''}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Left: Items List */}
                    <div className="lg:col-span-8">
                        <div className="space-y-6">
                            <AnimatePresence initial={false}>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex gap-6 md:gap-8 py-6 border-b border-gray-50 last:border-0 relative group"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-24 md:w-28 aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                            <Image
                                                src={item.image || '/placeholder.jpg'}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 flex flex-col md:flex-row gap-6 md:items-center">
                                            <div className="flex-1 space-y-1">
                                                <Link href={`/products/${item.productId}`} className="text-base font-bold text-gray-900 hover:opacity-70 transition-opacity">
                                                    {item.name}
                                                </Link>
                                                <p className="text-sm text-gray-400 font-bold tracking-tight">{formatPrice(item.price, language)}</p>
                                                {item.variant && (
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2">
                                                        {item.variant}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Quantity Control */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold text-gray-900 py-2">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Total */}
                                            <div className="text-right min-w-[100px]">
                                                <p className="text-base font-bold text-gray-900">
                                                    {formatPrice(item.price * item.quantity, language)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="mt-12">
                            <Link href="/products" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">
                                <ChevronLeft className="h-4 w-4" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Right: Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 bg-gray-50 rounded-2xl p-8 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-tight">Order Summary</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm text-gray-500 font-bold uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">{formatPrice(subtotal, language)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-bold uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-bold">{formatPrice(shipping, language)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-rose-600 font-bold uppercase tracking-widest">
                                        <span>Discount</span>
                                        <span>-{formatPrice(discount, language)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-gray-200 mb-8">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-lg font-bold text-gray-900 uppercase tracking-tight">Total</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-gray-900 tracking-tighter">{formatPrice(total, language)}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => router.push('/checkout')}
                                className="w-full h-20 bg-black text-white hover:bg-gray-800 rounded-sm text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 transition-all flex items-center justify-center gap-4"
                            >
                                Checkout <ArrowRight className="h-5 w-5" />
                            </Button>

                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-gray-400">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400">
                                    <RotateCcw className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">30-Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Saved Items Section */}
                {savedItems.length > 0 && (
                    <div className="mt-32 pt-20 border-t border-gray-50">
                        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-12">Saved for Later</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                            {savedItems.map((item) => (
                                <div key={item.id} className="group relative">
                                    <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-4 border border-gray-100">
                                        <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h3 className="text-xs font-bold text-gray-900 truncate mb-2">{item.name}</h3>
                                    <div className="flex gap-4">
                                        <button onClick={() => moveToCart(item.id)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Move to Cart</button>
                                        <button onClick={() => removeSavedItem(item.id)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-500">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
