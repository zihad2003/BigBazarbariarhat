'use client';

import { useState, useEffect } from 'react';
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
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/lib/stores/ui-store';
import { cn } from '@/lib/utils';
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
    const { items, getSubtotal, clearCart, getDiscountAmount } = useCartStore();
    const { addNotification } = useUIStore();

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
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
            
            const orderId = `${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            const orderData = {
                id: orderId,
                items,
                shipping: data,
                totals: { subtotal, shippingCost, discount, total: finalTotal },
                payment: { method: paymentMethod, details: paymentMethod === 'bkash' ? { bkashNumber } : {} },
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Store in localStorage
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
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
                        BIG BAZAR
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Lock className="h-3 w-3" /> Secure Checkout
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    {/* Left: Checkout Form */}
                    <div className="lg:col-span-7 space-y-16">
                        
                        {/* Shipping Section */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-8 uppercase tracking-tight">Shipping Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
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

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Division</label>
                                    <select 
                                        {...register('division')}
                                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium appearance-none"
                                    >
                                        {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">District</label>
                                    <select 
                                        {...register('district')}
                                        className="w-full px-5 py-4 bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium appearance-none"
                                    >
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Detailed Address</label>
                                    <textarea 
                                        {...register('address')}
                                        rows={3}
                                        className={cn("w-full px-5 py-4 bg-white border rounded-sm focus:outline-none focus:border-black transition-all text-sm font-medium resize-none", errors.address ? "border-rose-500" : "border-gray-200")}
                                        placeholder="House number, street name, area details"
                                    />
                                    {errors.address && <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider pl-1">{errors.address.message}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Payment Section */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-8 uppercase tracking-tight">Payment Method</h2>
                            <div className="space-y-4">
                                {[
                                    { id: 'cod', name: 'Cash on Delivery', icon: <Truck className="h-4 w-4" /> },
                                    { id: 'bkash', name: 'bKash Payment', icon: <div className="w-4 h-4 bg-[#E2136E] rounded-sm" /> },
                                    { id: 'nagad', name: 'Nagad Payment', icon: <div className="w-4 h-4 bg-orange-500 rounded-sm" /> },
                                ].map((method) => (
                                    <label 
                                        key={method.id}
                                        className={cn(
                                            "flex items-center p-6 border rounded-sm cursor-pointer transition-all",
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
                                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center mr-4 peer-checked:border-black">
                                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {method.icon}
                                            <span className="text-sm font-bold uppercase tracking-widest">{method.name}</span>
                                        </div>
                                    </label>
                                ))}

                                <AnimatePresence>
                                    {paymentMethod === 'bkash' && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="pt-2">
                                            <div className="p-6 bg-pink-50/50 border border-pink-100 rounded-sm">
                                                <label className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mb-2 block">bKash Number</label>
                                                <input 
                                                    type="tel"
                                                    value={bkashNumber}
                                                    onChange={(e) => setBkashNumber(e.target.value)}
                                                    className="w-full px-5 py-4 bg-white border border-pink-100 rounded-sm focus:outline-none focus:border-pink-500 transition-all text-sm font-medium"
                                                    placeholder="01XXXXXXXXX"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 bg-gray-50 rounded-sm p-8 md:p-12">
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
                                            <div className="mt-2 text-sm font-bold text-gray-900">Tk{(item.price * item.quantity).toLocaleString()}.00</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-gray-200">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-gray-900">Tk{subtotal.toLocaleString()}.00</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between items-center text-sm text-rose-500">
                                        <span>Discount</span>
                                        <span className="font-bold">− Tk{discount.toLocaleString()}.00</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className={cn("font-bold", shippingCost === 0 ? "text-emerald-500" : "text-gray-900")}>
                                        {shippingCost === 0 ? 'FREE' : `Tk${shippingCost.toLocaleString()}.00`}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between items-end pt-8 border-t border-gray-200 mt-4">
                                    <span className="text-base font-bold text-gray-900 uppercase tracking-tight">Total</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-gray-900 tracking-tight">Tk{finalTotal.toLocaleString()}.00</span>
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">BDT (VAT Incl.)</span>
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
