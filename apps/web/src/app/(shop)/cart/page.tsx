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
        <div className="bg-white min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                
                {/* Header Section */}
                <div className="flex justify-between items-baseline border-b border-gray-100 pb-10 mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Your cart</h1>
                    <Link href="/products" className="text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-black transition-colors">
                        Continue shopping
                    </Link>
                </div>

                {/* Table Headers (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-8 mb-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-4">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-3 text-right">Total</div>
                </div>

                <div className="space-y-10">
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
                                    <div className="relative w-24 md:w-32 aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image || '/placeholder.jpg'}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-0 left-0 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                            New
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center space-y-2">
                                        <Link href={`/products/${item.productId}`} className="text-base font-bold text-gray-900 hover:opacity-70 transition-opacity">
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-gray-500 font-medium">Tk{item.price.toLocaleString()}.00</p>
                                        {item.variant && (
                                            <div className="space-y-0.5 pt-2">
                                                {item.variant.split('/').map((v, i) => {
                                                    const [key, val] = v.includes(':') ? v.split(':') : [i === 0 ? 'Size' : 'Color', v];
                                                    return (
                                                        <p key={i} className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
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
                                    <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="w-10 text-center text-sm font-medium text-gray-900 border-x border-gray-200 py-2">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-black transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Item Total */}
                                <div className="col-span-1 md:col-span-3 text-right">
                                    <p className="text-base font-medium text-gray-900">
                                        Tk{(item.price * item.quantity).toLocaleString()}.00
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Footer / Summary Section */}
                <div className="mt-20 border-t border-gray-100 pt-12 flex flex-col items-end">
                    <div className="flex flex-col items-end space-y-4 max-w-md w-full">
                        <div className="flex items-baseline gap-6 mb-2">
                            <span className="text-lg font-bold text-gray-900">Estimated total</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-gray-900">Tk{total.toLocaleString()}.00</span>
                                <span className="text-sm font-bold text-gray-500">BDT</span>
                            </div>
                        </div>

                        <div className="pt-8 w-full">
                            <Button
                                onClick={() => router.push('/checkout')}
                                className="w-full h-16 bg-black text-white hover:bg-gray-900 rounded-sm text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-black/5"
                            >
                                Check out
                            </Button>
                        </div>

                        {/* Saved Items Link (Optional) */}
                        {savedItems.length > 0 && (
                            <div className="pt-10 w-full">
                                <button 
                                    onClick={() => {/* Scroll or Toggle Saved Items */}}
                                    className="w-full py-4 border border-gray-100 rounded-sm text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:border-gray-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Bookmark className="h-3 w-3" /> View Saved Artifacts ({savedItems.length})
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Saved Items Section (Minimal) */}
                {savedItems.length > 0 && (
                    <div className="mt-32 pt-20 border-t border-gray-50">
                        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-12 text-center">Pending Acquisitions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {savedItems.map((item) => (
                                <div key={item.id} className="group relative">
                                    <div className="aspect-[3/4] bg-gray-50 overflow-hidden mb-3">
                                        <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-900 truncate mb-1">{item.name}</h3>
                                    <div className="flex gap-4">
                                        <button onClick={() => moveToCart(item.id)} className="text-[9px] font-bold uppercase tracking-tighter text-gray-400 hover:text-black">Reinstate</button>
                                        <button onClick={() => removeSavedItem(item.id)} className="text-[9px] font-bold uppercase tracking-tighter text-gray-400 hover:text-rose-500">Discard</button>
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
