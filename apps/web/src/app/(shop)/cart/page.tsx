'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@bigbazar/shared'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
    const router = useRouter()

    // Select state from store
    const cartItems = useCartStore(state => state.items)
    const updateQuantity = useCartStore(state => state.updateQuantity)
    const removeItem = useCartStore(state => state.removeItem)
    const getSubtotal = useCartStore(state => state.getSubtotal)

    // Hydration fix
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    const subtotal = getSubtotal()
    const shipping = subtotal > 1500 ? 0 : 100 // Example logic
    const total = subtotal + shipping

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8 font-medium">Looks like you haven&apos;t added anything yet.</p>
                <Link href="/products">
                    <Button size="lg" className="uppercase tracking-widest font-bold rounded-xl px-8 h-12">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Shopping Bag <span className="text-gray-400 text-lg ml-2">({cartItems.length} items)</span></h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map((item) => {
                        const price = item.variant
                            ? (item.product.salePrice ?? item.product.basePrice) + item.variant.priceAdjustment
                            : (item.product.salePrice ?? item.product.basePrice);

                        return (
                            <div key={item.id} className="flex gap-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.product.images?.[0]?.url || '/placeholder.png'}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight mb-1">{item.product.name}</h3>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                                {item.variant ? item.variant.name : 'Standard'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-white rounded-l-lg transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-white rounded-r-lg transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <p className="font-black text-lg">
                                            {formatPrice(price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-3xl sticky top-24 border border-gray-100">
                        <h2 className="text-xl font-black uppercase tracking-tight mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="font-bold">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Shipping Estimate</span>
                                <span className="font-bold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                            </div>
                            {subtotal < 1500 && (
                                <div className="p-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-100 flex items-center justify-center text-center">
                                    Add {formatPrice(1500 - subtotal)} more for free shipping!
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                                <span className="font-black text-lg uppercase">Total</span>
                                <span className="font-black text-2xl tracking-tight">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 bg-black text-white rounded-xl uppercase tracking-widest font-black text-xs hover:scale-105 transition-transform shadow-lg shadow-black/20"
                            onClick={() => router.push('/checkout')}
                        >
                            Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="mt-6 flex justify-center">
                            <Link href="/products" className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest transition-colors border-b border-transparent hover:border-black pb-0.5">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
