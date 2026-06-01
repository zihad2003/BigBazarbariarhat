'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Lock,
    ArrowRight,
    Loader2,
    Truck,
    ShieldCheck,
    ShoppingBag,
    Package,
    CheckCircle2,
    MapPin,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn, formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { Breadcrumbs } from '@/components/shop/breadcrumbs';
import {
    BD_DISTRICTS,
    CHITTAGONG_UPAZILAS,
    getDeliveryInfo,
    type DeliveryZone
} from '@/lib/bd-geography';

// --- Validation Schema ---
const checkoutSchema = z.object({
    fullName: z.string().min(3, 'Full name is required'),
    phone: z.string().regex(/^01[3-9]\d{8}$/, 'Enter valid BD phone number (e.g. 01XXXXXXXXX)'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    district: z.string().min(1, 'District is required'),
    upazila: z.string().optional(),
    address: z.string().min(10, 'Full address is required'),
    deliveryNote: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const router = useRouter();
    const { items, getSubtotal, clearCart, getDiscountAmount } = useCartStore();
    const { addNotification } = useUIStore();

    const bkashNumberConfig = process.env.NEXT_PUBLIC_BKASH_NUMBER || '01857045449';
    const nagadNumberConfig = process.env.NEXT_PUBLIC_NAGAD_NUMBER || '01819134889';
    const codEnabledConfig = process.env.NEXT_PUBLIC_COD_ENABLED !== 'false';

    const initialMethod = useMemo(() => {
        if (codEnabledConfig) return 'cod';
        if (bkashNumberConfig && bkashNumberConfig !== 'SKIP') return 'bkash';
        if (nagadNumberConfig && nagadNumberConfig !== 'SKIP') return 'nagad';
        return 'cod';
    }, [codEnabledConfig, bkashNumberConfig, nagadNumberConfig]);

    const paymentMethods = useMemo(() => {
        const methods = [];
        if (codEnabledConfig) {
            methods.push({ id: 'cod', name: 'Cash on Delivery', icon: <Truck className="h-5 w-5" /> });
        }
        if (bkashNumberConfig && bkashNumberConfig !== 'SKIP') {
            methods.push({ id: 'bkash', name: 'bKash Payment', icon: <img src="/payments/bkash.png" alt="bKash" className="h-6 w-auto object-contain" /> });
        }
        if (nagadNumberConfig && nagadNumberConfig !== 'SKIP') {
            methods.push({ id: 'nagad', name: 'Nagad Payment', icon: <img src="/payments/nagad.png" alt="Nagad" className="h-6 w-auto object-contain" /> });
        }
        return methods;
    }, [codEnabledConfig, bkashNumberConfig, nagadNumberConfig]);

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
    const [bkashNumber, setBkashNumber] = useState('');

    useEffect(() => {
        setPaymentMethod(initialMethod as any);
    }, [initialMethod]);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            district: '',
            upazila: '',
            address: '',
            deliveryNote: '',
        }
    });

    const selectedDistrict = watch('district');
    const selectedUpazila = watch('upazila') || '';
    const isChittagong = selectedDistrict === 'Chittagong';

    // Reset upazila when district changes away from Chittagong
    useEffect(() => {
        if (!isChittagong) {
            setValue('upazila', '');
        }
    }, [isChittagong, setValue]);

    // Auto-calculate delivery info based on selections
    const deliveryInfo = useMemo(() => {
        return getDeliveryInfo(selectedDistrict, selectedUpazila);
    }, [selectedDistrict, selectedUpazila]);

    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    const shippingCost = selectedDistrict ? deliveryInfo.cost : 0;
    const finalTotal = Math.max(0, subtotal - discount + shippingCost);
    const advanceAmount = useMemo(() => {
        if (!selectedDistrict) return 0;
        if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
            return finalTotal;
        }
        return finalTotal >= 2000 ? 500 : shippingCost;
    }, [selectedDistrict, paymentMethod, finalTotal, shippingCost]);
    const remainingCOD = Math.max(0, finalTotal - advanceAmount);

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsLoading(true);
        try {
            const payload = {
                items: items.map(item => ({
                    productId: item.productId || item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: {
                    fullName: data.fullName,
                    phone: data.phone,
                    email: data.email,
                    district: data.district,
                    upazila: data.upazila || '',
                    address: data.address,
                    deliveryNote: data.deliveryNote,
                    deliveryArea: deliveryInfo.zone
                },
                totalAmount: finalTotal,
                paymentMethod: paymentMethod === 'cod' ? 'COD' : (paymentMethod === 'bkash' ? 'BKASH_MANUAL' : 'NAGAD_MANUAL'),
                paymentTransactionId: paymentMethod === 'cod' ? null : bkashNumber
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to place order in database');
            }

            const dbOrder = result.data;
            const orderId = dbOrder.orderNumber || dbOrder.id;

            const orderData = {
                id: orderId,
                items,
                shipping: { ...data, deliveryArea: deliveryInfo.zone },
                totals: { subtotal, shippingCost, discount, total: finalTotal },
                payment: { method: paymentMethod, details: paymentMethod === 'bkash' ? { bkashNumber } : {} },
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Store in localStorage for immediate frontend order confirmation page support
            const orders = JSON.parse(localStorage.getItem('bigbazar-orders') || '[]');
            localStorage.setItem('bigbazar-orders', JSON.stringify([...orders, orderData]));

            clearCart();
            router.push(`/order-confirmation/${orderId}`);
        } catch (error) {
            console.error('Checkout error:', error);
            addNotification({ type: 'error', message: 'Failed to process order. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-200 mb-6" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Your bag is empty</h1>
                <p className="text-gray-400 mb-8 max-w-md text-sm">Add items to your cart before proceeding to checkout.</p>
                <Link href="/products">
                    <Button className="h-14 px-10 bg-black text-white hover:bg-gray-900 rounded-sm font-bold text-xs uppercase tracking-widest">
                        Back to Shop
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Simple Header */}
            <header className="border-b border-gray-100 py-8">
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
                        BIG BAZAR
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Lock className="h-3 w-3" /> Secure Checkout
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-10">
                <Breadcrumbs 
                    items={[
                        { label: t?.common?.cart || 'Cart', href: '/cart' },
                        { label: t?.common?.checkout || 'Checkout', active: true }
                    ]} 
                />
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* Right: Checkout Form (Visual Order 2) */}
                    <div className="lg:col-span-7 space-y-20 lg:order-2">
                        
                        {/* Shipping Section */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-10 uppercase tracking-tight flex items-center gap-3">
                                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs">1</span>
                                Shipping Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                    <input 
                                        {...register('fullName')}
                                        className={cn("w-full px-5 py-4 bg-white border rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium", errors.fullName ? "border-rose-500" : "border-gray-200")}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.fullName && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-1">{errors.fullName.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                    <input 
                                        {...register('phone')}
                                        className={cn("w-full px-5 py-4 bg-white border rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium", errors.phone ? "border-rose-500" : "border-gray-200")}
                                        placeholder="01XXXXXXXXX"
                                    />
                                    {errors.phone && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-1">{errors.phone.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email (Optional)</label>
                                    <input 
                                        {...register('email')}
                                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                {/* District — All 64 Districts */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                                        District
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                                        <select 
                                            {...register('district')}
                                            className={cn(
                                                "w-full pl-11 pr-5 py-4 bg-white border rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium appearance-none",
                                                errors.district ? "border-rose-500" : "border-gray-200"
                                            )}
                                        >
                                            <option value="">Select your district</option>
                                            {BD_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    {errors.district && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-1">{errors.district.message}</p>}
                                </div>

                                {/* Upazila — Conditional for Chittagong Only */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
                                        Upazila / Thana
                                    </label>
                                    {isChittagong ? (
                                        <select 
                                            {...register('upazila')}
                                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium appearance-none"
                                        >
                                            <option value="">Select upazila</option>
                                            {CHITTAGONG_UPAZILAS.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    ) : (
                                        <input 
                                            {...register('upazila')}
                                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium"
                                            placeholder="Enter your upazila"
                                        />
                                    )}
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Detailed Address</label>
                                    <textarea 
                                        {...register('address')}
                                        rows={3}
                                        className={cn("w-full px-5 py-4 bg-white border rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium resize-none", errors.address ? "border-rose-500" : "border-gray-200")}
                                        placeholder="House number, street name, area details"
                                    />
                                    {errors.address && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-1">{errors.address.message}</p>}
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Delivery Note (Optional)</label>
                                    <input 
                                        {...register('deliveryNote')}
                                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium"
                                        placeholder="Any special instructions for delivery"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Delivery Cost Info — Auto-calculated */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-10 uppercase tracking-tight flex items-center gap-3">
                                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs">2</span>
                                Delivery
                            </h2>

                            <AnimatePresence mode="wait">
                                {!selectedDistrict ? (
                                    <motion.div
                                        key="no-district"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="p-6 bg-gray-50 border border-gray-100 rounded-sm text-center"
                                    >
                                        <MapPin className="h-6 w-6 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400 font-medium">Select your district above to see delivery charges</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={deliveryInfo.zone}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className={cn(
                                            "p-6 border rounded-sm flex items-center justify-between",
                                            deliveryInfo.zone === 'mirsharai'
                                                ? "border-emerald-200 bg-emerald-50/50"
                                                : "border-gray-200 bg-gray-50/50"
                                        )}>
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-sm flex items-center justify-center text-xl",
                                                    deliveryInfo.zone === 'mirsharai'
                                                        ? "bg-emerald-100"
                                                        : "bg-white border border-gray-100"
                                                )}>
                                                    {deliveryInfo.zone === 'mirsharai' ? '🎁' : deliveryInfo.zone === 'chittagong' ? '📦' : '📮'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">
                                                        {selectedDistrict}
                                                        {isChittagong && selectedUpazila ? ` — ${selectedUpazila}` : ''}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        {deliveryInfo.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-sm",
                                                deliveryInfo.zone === 'mirsharai'
                                                    ? "text-emerald-700 bg-emerald-100"
                                                    : "text-gray-900 bg-white border border-gray-100"
                                            )}>
                                                {deliveryInfo.zone === 'mirsharai' ? 'FREE' : formatPrice(deliveryInfo.cost, language)}
                                            </div>
                                        </div>

                                        {/* Weight notice */}
                                        <div className="mt-4 flex items-start gap-2.5 px-2">
                                            <Info className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                                Delivery charges may be higher depending on package weight and size. 
                                                We will contact you if additional charges apply before shipping.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Payment Section */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-10 uppercase tracking-tight flex items-center gap-3">
                                <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs">3</span>
                                Payment Method
                            </h2>
                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className="space-y-3">
                                        <label 
                                            className={cn(
                                                "flex items-center p-6 border rounded-sm cursor-pointer transition-all w-full",
                                                paymentMethod === method.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value={method.id} 
                                                checked={paymentMethod === method.id}
                                                onChange={() => setPaymentMethod(method.id as any)}
                                                className="hidden"
                                            />
                                            <div className={cn(
                                                "w-5 h-5 border-2 rounded-full flex items-center justify-center mr-4",
                                                paymentMethod === method.id ? "border-black" : "border-gray-200"
                                            )}>
                                                {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {method.icon}
                                                <span className="text-sm font-bold uppercase tracking-widest">{method.name}</span>
                                            </div>
                                        </label>

                                        <AnimatePresence>
                                            {paymentMethod === method.id && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    {method.id === 'cod' ? (
                                                        <div className="space-y-4">
                                                            {!selectedDistrict ? (
                                                                <div className="p-6 bg-slate-50 border border-slate-200 text-slate-950 rounded-xl space-y-4 shadow-sm">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                                                                <MapPin className="h-4 w-4" />
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Order Security Policy</h4>
                                                                                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">District Pending</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="pt-2 border-t border-slate-200">
                                                                        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                                                                            Please select your delivery district under **Shipping Details** above to calculate delivery charges and view confirmation steps.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ) : advanceAmount > 0 ? (
                                                                <div className="p-6 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl space-y-4 shadow-sm">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                                                                <Lock className="h-4 w-4 text-emerald-600" />
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Order Security Policy</h4>
                                                                                <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">Confirmation Step</p>
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-slate-200/80 text-slate-700">
                                                                            Required
                                                                        </span>
                                                                    </div>

                                                                    <div className="pt-2 border-t border-slate-200 space-y-3">
                                                                        {finalTotal >= 2000 ? (
                                                                            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                                                                                To secure and confirm your order, a secure advance payment of <span className="font-bold text-slate-900">৳500</span> is required. The remaining balance will be due on delivery.
                                                                            </p>
                                                                        ) : (
                                                                            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                                                                                To secure and confirm your order, please pay the delivery charge of <span className="font-bold text-slate-900">৳{shippingCost}</span> in advance. The product value will be due on delivery.
                                                                            </p>
                                                                        )}
                                                                        <div className="grid grid-cols-2 gap-4 pt-1">
                                                                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 shadow-xs">
                                                                                <span className="block text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Pay in Advance</span>
                                                                                <span className="text-sm font-black text-emerald-700">৳{advanceAmount}</span>
                                                                            </div>
                                                                            <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 shadow-xs">
                                                                                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Due on Delivery</span>
                                                                                <span className="text-sm font-black text-slate-800">৳{remainingCOD.toLocaleString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] text-emerald-800 font-bold leading-relaxed space-y-3">
                                                                        <div className="flex items-start gap-2">
                                                                            <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                                                            <span>
                                                                                Please send the advance amount of <span className="text-emerald-950 font-black">৳{advanceAmount}</span> to{' '}
                                                                                {bkashNumberConfig !== 'SKIP' && `bKash: `}
                                                                                {bkashNumberConfig !== 'SKIP' && <span className="text-emerald-900 font-black underline">{bkashNumberConfig}</span>}
                                                                                {bkashNumberConfig !== 'SKIP' && nagadNumberConfig !== 'SKIP' && ` or `}
                                                                                {nagadNumberConfig !== 'SKIP' && `Nagad: `}
                                                                                {nagadNumberConfig !== 'SKIP' && <span className="text-emerald-900 font-black underline">{nagadNumberConfig}</span>}
                                                                                {' '}(Personal) and enter your transaction/sender details below:
                                                                            </span>
                                                                        </div>
                                                                        <input 
                                                                            type="text"
                                                                            value={bkashNumber}
                                                                            onChange={(e) => setBkashNumber(e.target.value)}
                                                                            className="w-full px-4 py-3 bg-white border border-emerald-200 focus:border-emerald-500 rounded-lg focus:outline-none transition-all text-xs font-semibold text-emerald-950"
                                                                            placeholder="Enter bKash/Nagad sender phone or TrxID"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="p-6 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-100 space-y-4 shadow-sm">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                                            </div>
                                                                            <div>
                                                                                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">Free Delivery Active</h4>
                                                                                <p className="text-[9px] text-emerald-600 uppercase tracking-widest mt-0.5">Confirmation Step</p>
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                                                                            No Advance Needed
                                                                        </span>
                                                                    </div>
                                                                    <div className="pt-2 border-t border-emerald-100 space-y-3">
                                                                        <p className="text-xs font-medium text-emerald-900 leading-relaxed">
                                                                            Congratulations! Your order is eligible for **Free Delivery**. Because your order total is <span className="font-bold">৳{finalTotal.toLocaleString()}</span> and shipping is free, **no advance payment is required to confirm your order**!
                                                                        </p>
                                                                        <div className="grid grid-cols-2 gap-4 pt-1">
                                                                            <div className="bg-white/80 rounded-xl p-3 border border-emerald-100">
                                                                                <span className="block text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Pay in Advance</span>
                                                                                <span className="text-sm font-black text-emerald-700">৳0</span>
                                                                            </div>
                                                                            <div className="bg-white/80 rounded-xl p-3 border border-emerald-100">
                                                                                <span className="block text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Due on Delivery</span>
                                                                                <span className="text-sm font-black text-emerald-900">৳{finalTotal.toLocaleString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="p-4 bg-emerald-100/50 border border-emerald-200 rounded-lg text-[10px] text-emerald-800 font-bold leading-relaxed flex items-start gap-2">
                                                                        <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                                                        <span>You can pay the total amount of ৳{finalTotal.toLocaleString()} directly to the rider once you inspect your package!</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className={cn(
                                                            "p-6 rounded-xl border shadow-sm",
                                                            method.id === 'bkash' 
                                                                ? "bg-pink-50/50 border-pink-100 text-pink-900" 
                                                                : "bg-orange-50/50 border-orange-100 text-orange-900"
                                                        )}>
                                                            <label className={cn(
                                                                "text-[10px] font-black uppercase tracking-widest mb-2 block",
                                                                method.id === 'bkash' ? "text-pink-600" : "text-orange-600"
                                                            )}>
                                                                {method.id === 'bkash' ? 'bKash Sender / Transaction Number' : 'Nagad Sender / Transaction Number'}
                                                            </label>
                                                            <p className={cn(
                                                                "text-[10px] mb-4 uppercase tracking-widest font-semibold",
                                                                method.id === 'bkash' ? "text-pink-400" : "text-orange-400"
                                                            )}>
                                                                Send money to: <span className="font-bold">{method.id === 'bkash' ? bkashNumberConfig : nagadNumberConfig}</span>
                                                            </p>
                                                            <input 
                                                                type="text"
                                                                value={bkashNumber}
                                                                onChange={(e) => setBkashNumber(e.target.value)}
                                                                className={cn(
                                                                    "w-full px-5 py-4 bg-white border rounded-xl focus:outline-none transition-all text-sm font-medium",
                                                                    method.id === 'bkash' ? "border-pink-100 focus:border-pink-500" : "border-orange-100 focus:border-orange-500"
                                                                )}
                                                                placeholder={method.id === 'bkash' ? "Enter bkash sender phone or TrxID" : "Enter Nagad sender phone or TrxID"}
                                                            />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}

                                {/* Return & Inspection Policy Callout */}
                                <div className="p-6 bg-amber-50 text-amber-950 rounded-2xl border border-amber-200 space-y-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                                                <ShieldCheck className="h-4 w-4 text-amber-700" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-wider text-amber-800">Return & Inspection Policy</h4>
                                                <p className="text-[9px] text-amber-600 uppercase tracking-widest mt-0.5">রিটার্ন পলিসি</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-amber-200/60 space-y-3.5 text-xs text-amber-900 leading-relaxed font-semibold">
                                        <p className="flex items-start gap-2.5">
                                            <span className="text-amber-700 font-bold uppercase tracking-widest shrink-0 mt-0.5">BN:</span>
                                            <span>রাইডার পৌঁছানোর পর কাস্টমার পণ্য চেক করে তাৎক্ষণিকভাবে ফেরত দিতে পারবেন। এই ক্ষেত্রে কাস্টমারকে শুধুমাত্র ডেলিভারি চার্জটি পরিশোধ করতে হবে। পরবর্তীতে কোনো রিটার্ন গ্রহণযোগ্য নয়।</span>
                                        </p>
                                        <p className="flex items-start gap-2.5 border-t border-amber-200/40 pt-3">
                                            <span className="text-amber-700 font-bold uppercase tracking-widest shrink-0 mt-0.5">EN:</span>
                                            <span>You can inspect the product immediately when the rider arrives. If you decide to return it, you can return it on the spot with the rider by paying <span className="text-amber-900 font-black underline">ONLY the delivery fee</span>. Returns after the rider has left are not accepted.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Left: Order Summary (Visual Order 1) */}
                    <div className="lg:col-span-5 lg:order-1">
                        <div className="sticky top-32 bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-10 uppercase tracking-tight">Order Summary</h2>
                            
                            <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-6">
                                        <div className="relative w-16 aspect-[3/4] bg-white rounded-sm overflow-hidden shrink-0">
                                            <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                                            <div className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-gray-900 uppercase tracking-tight mb-1">{item.name}</h4>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.variant || 'Standard'}</p>
                                            <div className="mt-2 text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity, language)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-200">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-gray-900">{formatPrice(subtotal, language)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between items-center text-sm text-rose-500">
                                        <span>Discount</span>
                                        <span className="font-bold">− {formatPrice(discount, language)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className={cn("font-bold", shippingCost === 0 ? "text-emerald-500" : "text-gray-900")}>
                                        {!selectedDistrict ? '—' : shippingCost === 0 ? 'FREE' : formatPrice(shippingCost, language)}
                                    </span>
                                </div>

                                <div className="space-y-2 pt-4 border-t border-dashed border-gray-200 text-xs">
                                    <div className="flex justify-between items-center text-amber-600 font-bold uppercase tracking-wider">
                                        <span>Advance Confirmation Payment</span>
                                        <span>{formatPrice(advanceAmount, language)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-500 font-medium">
                                        <span>Due on Delivery</span>
                                        <span>{formatPrice(remainingCOD, language)}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-end pt-6 border-t border-gray-200 mt-4">
                                    <span className="text-base font-bold text-gray-900 uppercase tracking-tight">Total</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-gray-900 tracking-tight">{formatPrice(finalTotal, language)}</span>
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">BDT</span>
                                    </div>
                                </div>

                                <div className="pt-10">
                                    <Button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-16 bg-black text-white hover:bg-gray-900 rounded-sm text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-black/5"
                                    >
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Place Order"}
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                        <ShieldCheck className="h-3.5 w-3.5" /> Secure SSL Encrypted Checkout
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
