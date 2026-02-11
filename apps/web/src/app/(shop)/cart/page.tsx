'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

// This will be replaced with actual state management
const cartItems = [
    { id: '1', name: 'Signature Tee', price: 999, quantity: 2, image: '/products/tee-1.jpg' },
    { id: '2', name: 'Classic Polo', price: 1299, quantity: 1, image: '/products/polo-1.jpg' },
]

export default function CartPage() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal > 1500 ? 0 : 100
    const total = subtotal + shipping

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-6" />
                <h1 className="text-2xl font-bold uppercase mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
                <Link href="/">
                    <Button size="lg" className="uppercase tracking-wider font-bold">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <>
            {/* Page Header */}
            <section className="py-12 px-6 lg:px-8 border-b">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold uppercase">Shopping Cart</h1>
                </div>
            </section>

            {/* Cart Content */}
            <section className="py-12 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-6 py-6 border-b">
                                    <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-semibold uppercase">{item.name}</h3>
                                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">{formatPrice(item.price)}</p>
                                        <div className="flex items-center gap-3">
                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-8 sticky top-24">
                            <h2 className="text-lg font-bold uppercase mb-6">Order Summary</h2>
                            <div className="space-y-4 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                </div>
                                {subtotal < 1500 && (
                                    <p className="text-xs text-gray-500">
                                        Add {formatPrice(1500 - subtotal)} more for free shipping
                                    </p>
                                )}
                                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>
                            <Button className="w-full uppercase tracking-wider font-bold" size="lg">
                                Proceed to Checkout
                            </Button>
                            <Link href="/" className="block text-center mt-4 text-sm text-gray-600 hover:text-black">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
