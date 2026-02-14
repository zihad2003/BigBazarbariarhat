'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@bigbazar/shared'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type CouponMessage = {
    type: 'success' | 'error' | 'info'
    text: string
}

const FREE_SHIPPING_THRESHOLD = 2000

export default function CartPage() {
    const router = useRouter()

    const cartItems = useCartStore(state => state.items)
    const savedItems = useCartStore(state => state.savedItems)
    const updateQuantity = useCartStore(state => state.updateQuantity)
    const removeItem = useCartStore(state => state.removeItem)
    const saveForLater = useCartStore(state => state.saveForLater)
    const moveToCart = useCartStore(state => state.moveToCart)
    const removeSavedItem = useCartStore(state => state.removeSavedItem)
    const applyCoupon = useCartStore(state => state.applyCoupon)
    const removeCoupon = useCartStore(state => state.removeCoupon)
    const couponCode = useCartStore(state => state.couponCode)
    const getSubtotal = useCartStore(state => state.getSubtotal)
    const getDiscountAmount = useCartStore(state => state.getDiscountAmount)
    const getShippingCost = useCartStore(state => state.getShippingCost)
    const getTotal = useCartStore(state => state.getTotal)

    const [couponInput, setCouponInput] = useState(couponCode ?? '')
    const [couponMessage, setCouponMessage] = useState<CouponMessage | null>(null)

    // Hydration fix
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        setCouponInput(couponCode ?? '')
    }, [couponCode])

    if (!isMounted) return null

    const subtotal = getSubtotal()
    const discount = getDiscountAmount()
    const shipping = getShippingCost()
    const total = getTotal()
    const isCheckoutDisabled = cartItems.length === 0

    const handleApplyCoupon = () => {
        const result = applyCoupon(couponInput)
        setCouponMessage({
            type: result.success ? 'success' : 'error',
            text: result.message,
        })
    }

    const handleRemoveCoupon = () => {
        removeCoupon()
        setCouponMessage({ type: 'info', text: 'Coupon removed.' })
    }

    if (cartItems.length === 0 && savedItems.length === 0) {
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
                <div className="lg:col-span-2 space-y-10">
                    {cartItems.length > 0 && (
                        <div className="space-y-6">
                            {cartItems.map((item) => {
                                const price = item.variant
                                    ? (item.product.salePrice ?? item.product.basePrice) + (item.variant.priceAdjustment ?? 0)
                                    : (item.product.salePrice ?? item.product.basePrice)

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

                                            <button
                                                onClick={() => saveForLater(item.id)}
                                                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-2"
                                            >
                                                <Bookmark className="h-3.5 w-3.5" />
                                                Save for later
                                            </button>

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
                                )
                            })}
                        </div>
                    )}

                    {savedItems.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black uppercase tracking-tight">Saved for Later</h2>
                                <span className="text-xs text-gray-500 font-semibold">{savedItems.length} items</span>
                            </div>
                            <div className="space-y-4">
                                {savedItems.map((item) => {
                                    const price = item.variant
                                        ? (item.product.salePrice ?? item.product.basePrice) + (item.variant.priceAdjustment ?? 0)
                                        : (item.product.salePrice ?? item.product.basePrice)

                                    return (
                                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-2xl">
                                            <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.product.images?.[0]?.url || '/placeholder.png'}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-base">{item.product.name}</h3>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                                    {item.variant ? item.variant.name : 'Standard'}
                                                </p>
                                                <p className="font-bold text-sm mt-2">{formatPrice(price * item.quantity)}</p>
                                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                                    <Button size="sm" variant="outline" onClick={() => moveToCart(item.id)}>
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
                                    )}
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-3xl sticky top-24 border border-gray-100 space-y-6">
                        <h2 className="text-xl font-black uppercase tracking-tight">Order Summary</h2>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Coupon code"
                                    value={couponInput}
                                    onChange={(event) => setCouponInput(event.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                {couponCode ? (
                                    <Button size="sm" variant="outline" onClick={handleRemoveCoupon}>
                                        Remove
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
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

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="font-bold">{formatPrice(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Discount</span>
                                    <span className="font-bold text-green-600">- {formatPrice(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Shipping Estimate</span>
                                <span className="font-bold">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                            </div>
                            {subtotal < FREE_SHIPPING_THRESHOLD && (
                                <div className="p-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-100 flex items-center justify-center text-center">
                                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping!
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                                <span className="font-black text-lg uppercase">Total</span>
                                <span className="font-black text-2xl tracking-tight">{formatPrice(total)}</span>
                            </div>
                        </div>

                        {isCheckoutDisabled && (
                            <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
                                Move saved items back to your cart to continue checkout.
                            </p>
                        )}

                        <Button
                            className="w-full h-14 bg-black text-white rounded-xl uppercase tracking-widest font-black text-xs hover:scale-105 transition-transform shadow-lg shadow-black/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            onClick={() => router.push('/checkout')}
                            disabled={isCheckoutDisabled}
                        >
                            Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="flex justify-center">
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
