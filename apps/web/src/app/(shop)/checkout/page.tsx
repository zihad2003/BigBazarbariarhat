'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    ChevronRight,
    MapPin,
    CreditCard,
    CheckCircle2,
    Lock,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Truck,
    ShieldCheck,
    Sparkles,
    ShoppingBag,
    Package,
    AlertCircle,
    BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { useSession } from 'next-auth/react';
import { formatPrice, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- BD Geography Data ---
const DIVISIONS = [
    'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'
];

const DISTRICTS: Record<string, string[]> = {
    'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 'Munshiganj'],
    'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Comilla', 'Feni', 'Noakhali'],
    'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    'Rajshahi': ['Rajshahi', 'Bogra', 'Pabna', 'Naogaon', 'Natore'],
    'Khulna': ['Khulna', 'Jessore', 'Satkhira', 'Kushtia', 'Bagerhat'],
    'Barisal': ['Barisal', 'Bhola', 'Patuakhali', 'Pirojpur'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram'],
    'Mymensingh': ['Mymensingh', 'Netrokona', 'Sherpur', 'Jamalpur']
};

// --- Validation Schema ---
const checkoutSchema = z.object({
    fullName: z.string().min(3, 'Full name is required'),
    phone: z.string().regex(/^01[3-9]\d{8}$/, 'Enter valid BD phone number (e.g. 01XXXXXXXXX)'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    division: z.string().min(1, 'Division is required'),
    district: z.string().min(1, 'District is required'),
    upazila: z.string().min(1, 'Upazila/Thana is required'),
    address: z.string().min(10, 'Full address is required'),
    deliveryNote: z.string().optional(),
    saveAddress: z.boolean().default(false),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { items, getSubtotal, clearCart, getDiscountAmount, getTotal, getItemCount, couponCode } = useCartStore();
    const { addNotification } = useUIStore();

    // State
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
    const [bkashNumber, setBkashNumber] = useState('');

    // Form
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            division: 'Dhaka',
            district: '',
            saveAddress: true
        }
    });

    const selectedDivision = watch('division');
    const districts = DISTRICTS[selectedDivision] || [];

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/checkout');
        }
    }, [status, router]);

    useEffect(() => {
        if (districts.length > 0) {
            setValue('district', districts[0]);
        }
    }, [selectedDivision, districts, setValue]);

    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    
    // Delivery Logic
    const isFreeShipping = subtotal >= 1000;
    const shippingCost = isFreeShipping ? 0 : (deliveryMethod === 'express' ? 120 : 60);
    const finalTotal = Math.max(0, subtotal - discount + shippingCost);

    const onSubmit = async (data: CheckoutFormValues) => {
        setIsLoading(true);
        try {
            // Mock API Call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const orderId = `BB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const orderData = {
                id: orderId,
                items,
                shipping: data,
                totals: { subtotal, shippingCost, discount, total: finalTotal },
                payment: { method: paymentMethod, details: paymentMethod === 'bkash' ? { bkashNumber } : {} },
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Store in localStorage as requested
            const orders = JSON.parse(localStorage.getItem('bigbazar-orders') || '[]');
            localStorage.setItem('bigbazar-orders', JSON.stringify([...orders, orderData]));

            clearCart();
            router.push(`/order-confirmation/${orderId}`);
        } catch (error) {
            addNotification({ type: 'error', message: 'Failed to process order. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-8 border border-gray-100">
                    <ShoppingBag className="h-12 w-12 text-gray-200" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">Bag is Empty</h1>
                <p className="text-gray-400 mb-10 max-w-md font-medium">Add some artifacts to your curation before proceeding to checkout.</p>
                <Link href="/products">
                    <Button className="rounded-[1.5rem] px-10 h-16 bg-black text-white hover:bg-gray-800 transition-all font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20">
                        Back to Storefront
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fafafa] min-h-screen pb-24 font-sans">
            {/* Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tighter uppercase font-playfair">
                        BIG BAZAR<span className="text-indigo-600">.</span>
                    </Link>
                    <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                        <Lock className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Secured Protocol</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Left: Checkout Process */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Step 1: Delivery Information */}
                        <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm shadow-black/5">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-14 h-14 bg-black rounded-[2rem] flex items-center justify-center text-white">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Delivery Logistics</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Recipient & Destination Coordinates</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Full Legal Name *</label>
                                    <input 
                                        {...register('fullName')}
                                        className={cn("w-full px-6 py-5 bg-gray-50 border rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight", errors.fullName ? "border-rose-500" : "border-gray-50")}
                                        placeholder="EX: ABDUR RAHMAN"
                                    />
                                    {errors.fullName && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-2">{errors.fullName.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Terminal ID (Phone) *</label>
                                    <input 
                                        {...register('phone')}
                                        className={cn("w-full px-6 py-5 bg-gray-50 border rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight", errors.phone ? "border-rose-500" : "border-gray-50")}
                                        placeholder="01XXXXXXXXX"
                                    />
                                    {errors.phone && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-2">{errors.phone.message}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Sync Channel (Email)</label>
                                    <input 
                                        {...register('email')}
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight"
                                        placeholder="CURATOR@DOMAIN.COM"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Division *</label>
                                    <select 
                                        {...register('division')}
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight appearance-none"
                                    >
                                        {DIVISIONS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">District *</label>
                                    <select 
                                        {...register('district')}
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight appearance-none"
                                    >
                                        {districts.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Upazila / Thana *</label>
                                    <input 
                                        {...register('upazila')}
                                        className={cn("w-full px-6 py-5 bg-gray-50 border rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight", errors.upazila ? "border-rose-500" : "border-gray-50")}
                                        placeholder="EX: MIRPUR-10"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Full Delivery Address *</label>
                                    <textarea 
                                        {...register('address')}
                                        rows={3}
                                        className={cn("w-full px-6 py-5 bg-gray-50 border rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight resize-none", errors.address ? "border-rose-500" : "border-gray-50")}
                                        placeholder="HOUSE NO, STREET, AREA DETAILS..."
                                    />
                                    {errors.address && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-2">{errors.address.message}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Special Manifest (Note)</label>
                                    <input 
                                        {...register('deliveryNote')}
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black tracking-tight"
                                        placeholder="GIFT WRAP, GATE CODE, CALL BEFORE DELIVERY..."
                                    />
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" {...register('saveAddress')} className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-lg checked:bg-black checked:border-black transition-all" />
                                            <BadgeCheck className="absolute inset-0 m-auto h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Archive this coordinate for future acquisition</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Step 2: Delivery Method */}
                        <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm shadow-black/5">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-14 h-14 bg-black rounded-[2rem] flex items-center justify-center text-white">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Transit Matrix</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Velocity & Logistics Selection</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('standard')}
                                    className={cn("flex items-center p-8 rounded-[2rem] border transition-all text-left group", deliveryMethod === 'standard' ? "border-black bg-gray-50 shadow-xl shadow-black/5 ring-1 ring-black/5" : "border-gray-50 hover:border-gray-200 bg-white")}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-black text-gray-900 text-sm uppercase tracking-widest">Standard Delivery</span>
                                            {isFreeShipping && <span className="text-[8px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black uppercase">Free</span>}
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">3 - 5 Solar Days Transit</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn("font-black text-sm font-mono", isFreeShipping ? "text-indigo-600" : "text-gray-900")}>
                                            {isFreeShipping ? '0.00' : '60.00'}
                                        </span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('express')}
                                    className={cn("flex items-center p-8 rounded-[2rem] border transition-all text-left group", deliveryMethod === 'express' ? "border-black bg-gray-50 shadow-xl shadow-black/5 ring-1 ring-black/5" : "border-gray-50 hover:border-gray-200 bg-white")}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-black text-gray-900 text-sm uppercase tracking-widest">Express Dispatch</span>
                                            <Sparkles className="h-3 w-3 text-indigo-500" />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">1 - 2 Solar Days Transit</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-black text-sm font-mono text-gray-900">120.00</span>
                                    </div>
                                </button>
                            </div>
                        </section>

                        {/* Step 3: Payment Method */}
                        <section className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm shadow-black/5">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-14 h-14 bg-black rounded-[2rem] flex items-center justify-center text-white">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Instrument Selection</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Authorized Transaction Channel</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { id: 'cod', name: 'Cash on Delivery', sub: 'Protocol Default', icon: '৳', badge: 'Most Popular' },
                                        { id: 'bkash', name: 'bKash Wallet', sub: 'Digital Authorization', icon: 'bK' },
                                        { id: 'nagad', name: 'Nagad Wallet', sub: 'Digital Authorization', icon: 'Na' },
                                        { id: 'card', name: 'Global Credit/Debit', sub: 'Phase 2: Coming Soon', icon: '💳', disabled: true },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            disabled={method.disabled}
                                            onClick={() => setPaymentMethod(method.id as any)}
                                            className={cn(
                                                "flex items-center p-8 rounded-[2rem] border transition-all text-left relative overflow-hidden group",
                                                paymentMethod === method.id ? "border-black bg-gray-50 shadow-xl shadow-black/5" : "border-gray-50 bg-white hover:border-gray-200",
                                                method.disabled && "opacity-40 cursor-not-allowed grayscale"
                                            )}
                                        >
                                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xs mr-5 shrink-0">
                                                {method.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-black text-gray-900 text-[11px] uppercase tracking-widest">{method.name}</span>
                                                    {method.badge && <span className="text-[7px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{method.badge}</span>}
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{method.sub}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Conditional Fields */}
                                <AnimatePresence>
                                    {paymentMethod === 'bkash' && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="p-8 bg-pink-50/30 border border-pink-100 rounded-[2rem] space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[#E2136E] rounded-xl flex items-center justify-center text-white font-black text-xs">bK</div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E2136E]">Secure bKash Synchronization</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">bKash Account Number</label>
                                                    <input 
                                                        type="tel"
                                                        value={bkashNumber}
                                                        onChange={(e) => setBkashNumber(e.target.value)}
                                                        className="w-full px-6 py-5 bg-white border border-pink-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/10 transition-all text-sm font-black tracking-tight placeholder:text-pink-200"
                                                        placeholder="01XXXXXXXXX"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>
                    </div>

                    {/* Right: Order Summary Module */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-8">
                            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[5rem] group-hover:scale-110 transition-transform -mr-12 -mt-12" />
                                
                                <div className="flex items-center gap-4 mb-12">
                                    <Package className="h-5 w-5 text-indigo-600" />
                                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Curation Manifest</h3>
                                </div>

                                <div className="space-y-8 mb-12 max-h-[360px] overflow-y-auto no-scrollbar pr-2">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-6 group">
                                            <div className="relative w-20 aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-50">
                                                <Image
                                                    src={item.image || '/placeholder.jpg'}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                                <div className="absolute top-1 right-1 bg-black text-white text-[8px] font-black px-1.5 py-0.5 rounded-lg shadow-xl">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 py-1">
                                                <h4 className="font-black text-xs text-gray-900 line-clamp-2 uppercase tracking-tight mb-2">{item.name}</h4>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{item.variant || 'Standard'}</span>
                                                    <span className="font-black text-sm text-gray-900 font-mono tracking-tighter">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-8 border-t border-gray-50">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="AUTHORIZATION CODE"
                                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-50 rounded-xl text-[9px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-black/5"
                                        />
                                        <Button variant="outline" className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border-gray-100">
                                            Apply
                                        </Button>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Initial Assessment</span>
                                        <span className="text-gray-900 font-mono">{formatPrice(subtotal)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                            <span>Artifact Credit</span>
                                            <span className="font-mono">-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Transit Logistics</span>
                                        <span className={cn("font-mono", shippingCost === 0 ? "text-indigo-600" : "text-gray-900")}>
                                            {shippingCost === 0 ? "COMPLIMENTARY" : formatPrice(shippingCost)}
                                        </span>
                                    </div>
                                    
                                    <div className="pt-10 border-t border-gray-100 mt-10">
                                        <div className="flex justify-between items-end mb-10">
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Final Authorization</p>
                                                <h4 className="text-4xl font-black text-gray-900 tracking-tighter font-mono">{formatPrice(finalTotal)}</h4>
                                            </div>
                                            <ShieldCheck className="h-8 w-8 text-indigo-100 mb-1" />
                                        </div>

                                        <Button 
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full h-24 bg-black text-white hover:bg-gray-800 rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 group relative overflow-hidden"
                                        >
                                            <AnimatePresence mode="wait">
                                                {isLoading ? (
                                                    <motion.div key="loading" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-3">
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Authorizing...
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="idle" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-3">
                                                        Execute Transaction <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-[2.5rem] p-8 flex gap-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full" />
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div className="relative z-10">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Secure Sync Protocol</h5>
                                    <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Your data is encrypted via 256-bit SSL protocols for zero-risk artifact acquisition.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
