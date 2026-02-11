'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowLeft, ShieldCheck, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/store/use-cart';
import { OrdersService, PaymentMethod } from '@bigbazar/shared';
import { Button } from '@/components/ui/button';
// import { toast } from '@/components/ui/use-toast'; 

const checkoutSchema = z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().min(4, 'Postal code is required'),
    paymentMethod: z.enum(['CASH_ON_DELIVERY', 'BKASH', 'NAGAD', 'ROCKET', 'SSL_COMMERZ', 'STRIPE']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const cart = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            paymentMethod: 'CASH_ON_DELIVERY',
        },
    });

    const selectedPaymentMethod = watch('paymentMethod');

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsSubmitting(true);
        try {
            const orderItems = cart.items.map(item => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
            }));

            const result = await OrdersService.createOrder({
                guestEmail: data.email,
                guestName: `${data.firstName} ${data.lastName}`,
                guestPhone: data.phone,
                guestAddress: {
                    fullName: `${data.firstName} ${data.lastName}`,
                    phone: data.phone,
                    addressLine1: data.address,
                    city: data.city,
                    postalCode: data.postalCode,
                    country: 'Bangladesh', // Default for now
                    label: 'Home',
                    isDefault: true
                },
                paymentMethod: data.paymentMethod as PaymentMethod,
                items: orderItems,
            });

            if (result.success && result.data) {
                cart.clearCart();
                router.push(`/checkout/success?orderId=${result.data.id}`);
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Checkout Error:', error);
            alert('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Your Bag is Empty</h1>
                    <p className="text-gray-500 font-medium">Add some exclusive items to proceed to checkout.</p>
                    <Link href="/">
                        <Button className="mt-4 px-8 py-6 rounded-full text-xs font-black uppercase tracking-widest bg-black text-white hover:scale-105 transition-all">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const subtotal = cart.items.reduce((acc, item) => {
        const price = item.variant?.priceAdjustment
            ? (item.product.salePrice ?? item.product.basePrice) + item.variant.priceAdjustment
            : (item.product.salePrice ?? item.product.basePrice);
        return acc + price * item.quantity;
    }, 0);

    const shippingCost = 120; // Fixed for now
    const total = subtotal + shippingCost;

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Bag
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left: Form */}
                    <div className="space-y-10">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">Checkout</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">Secure Transaction Gateway</p>
                        </div>

                        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Contact Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-900 focus:border-black transition-all outline-none placeholder:text-gray-300"
                                        />
                                        {errors.email && <span className="text-rose-500 text-xs font-bold mt-1 block px-2">{errors.email.message}</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <input
                                                {...register('firstName')}
                                                placeholder="First Name"
                                                className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-900 focus:border-black transition-all outline-none placeholder:text-gray-300"
                                            />
                                            {errors.firstName && <span className="text-rose-500 text-xs font-bold mt-1 block px-2">{errors.firstName.message}</span>}
                                        </div>
                                        <div className="relative group">
                                            <input
                                                {...register('lastName')}
                                                placeholder="Last Name"
                                                className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-900 focus:border-black transition-all outline-none placeholder:text-gray-300"
                                            />
                                            {errors.lastName && <span className="text-rose-500 text-xs font-bold mt-1 block px-2">{errors.lastName.message}</span>}
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            {...register('phone')}
                                            placeholder="Phone Number"
                                            className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-900 focus:border-black transition-all outline-none placeholder:text-gray-300"
                                        />
                                        {errors.phone && <span className="text-rose-500 text-xs font-bold mt-1 block px-2">{errors.phone.message}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Shipping Address</h3>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            {...register('address')}
                                            placeholder="Street Address"
                                            className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-900 focus:border-black transition-all outline-none placeholder:text-gray-300"
                                        />
                                        {errors.address && <span className="text-rose-500 text-xs font-bold mt-1 block px-2">{errors.address.message}</span>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <input
                                                {...register('city')}
                                                placeholder="City"
                                                className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-900 focus:border-black transition-all outline-none placeholder:text-gray-300"
                                            />
                                            {errors.city && <span className="text-rose-500 text-xs font-bold mt-1 block px-2">{errors.city.message}</span>}
                                        </div>
                                        <div className="relative group">
                                            <input
                                                {...register('postalCode')}
                                                placeholder="Postal Code"
                                                className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-900 focus:border-black transition-all outline-none placeholder:text-gray-300"
                                            />
                                            {errors.postalCode && <span className="text-rose-500 text-xs font-bold mt-1 block px-2">{errors.postalCode.message}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Payment Method</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border-2 rounded-2xl p-6 flex items-start gap-4 transition-all hover:shadow-lg ${selectedPaymentMethod === 'CASH_ON_DELIVERY' ? 'border-black bg-black text-white' : 'border-gray-100 bg-white'}`}>
                                        <input
                                            type="radio"
                                            value="CASH_ON_DELIVERY"
                                            {...register('paymentMethod')}
                                            className="hidden"
                                        />
                                        <Banknote className="h-6 w-6 flex-shrink-0" />
                                        <div>
                                            <span className="font-black text-sm uppercase tracking-widest block mb-1">Cash on Delivery</span>
                                            <span className={`text-xs block ${selectedPaymentMethod === 'CASH_ON_DELIVERY' ? 'text-gray-400' : 'text-gray-500'}`}>Pay when you receive your order</span>
                                        </div>
                                    </label>

                                    <label className={`cursor-pointer border-2 rounded-2xl p-6 flex items-start gap-4 transition-all hover:shadow-lg ${selectedPaymentMethod === 'SSL_COMMERZ' ? 'border-black bg-black text-white' : 'border-gray-100 bg-white'}`}>
                                        <input
                                            type="radio"
                                            value="SSL_COMMERZ"
                                            {...register('paymentMethod')}
                                            className="hidden"
                                        />
                                        <CreditCard className="h-6 w-6 flex-shrink-0" />
                                        <div>
                                            <span className="font-black text-sm uppercase tracking-widest block mb-1">Online Payment</span>
                                            <span className={`text-xs block ${selectedPaymentMethod === 'SSL_COMMERZ' ? 'text-gray-400' : 'text-gray-500'}`}>Secure payment via SSLCommerz</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:sticky lg:top-12 h-fit space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-8">Order Summary</h3>

                            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 relative">
                                            {item.product.images?.[0] ? (
                                                <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                                            ) : <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-xs">IMG</div>}
                                            <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                                x{item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 truncate">{item.product.name}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                                {item.variant ? `${item.variant.name}` : `SKU: ${item.product.sku}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900">
                                                ৳{(item.variant?.priceAdjustment
                                                    ? (item.product.salePrice ?? item.product.basePrice) + item.variant.priceAdjustment
                                                    : (item.product.salePrice ?? item.product.basePrice)).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">৳{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-gray-900">৳{shippingCost.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                                    <span className="text-base font-black text-gray-900 uppercase tracking-widest">Total</span>
                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">৳{total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting}
                                className="w-full mt-8 h-16 bg-black text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                        Confirm Order
                                    </>
                                )}
                            </Button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <ShieldCheck className="h-3 w-3" />
                                Secure Checkout with SSL Encryption
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
