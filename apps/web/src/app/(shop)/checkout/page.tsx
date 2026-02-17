'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    ChevronRight,
    MapPin,
    CreditCard,
    CheckCircle2,
    Lock,
    ArrowLeft,
    Info,
    Loader2,
    Truck,
    ShieldCheck,
    Sparkles,
    ShoppingBag,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@bigbazar/shared';
import { useUIStore } from '@/lib/stores/ui-store';
import { useUser } from '@clerk/nextjs';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
    { id: 'shipping', label: 'Shipping', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: CheckCircle2 },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [currentStep, setCurrentStep] = useState('shipping');
    const [loading, setLoading] = useState(false);

    // Form state
    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: 'Dhaka',
        phone: '',
    });

    // Validation state
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const { items, getSubtotal, clearCart, getShippingCost, getDiscountAmount, getTotal } = useCartStore();
    const { addNotification } = useUIStore();

    useEffect(() => {
        if (isLoaded && user) {
            setShippingData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.primaryEmailAddress?.emailAddress || '',
            }));
        }
    }, [isLoaded, user]);

    const subtotal = getSubtotal();
    const shipping = getShippingCost();
    const discount = getDiscountAmount();
    const total = getTotal();

    const validateShipping = () => {
        const newErrors: { [key: string]: string } = {};
        if (!shippingData.firstName.trim()) newErrors.firstName = 'Required';
        if (!shippingData.lastName.trim()) newErrors.lastName = 'Required';
        if (!shippingData.email.trim()) {
            newErrors.email = 'Required';
        } else if (!/\S+@\S+\.\S+/.test(shippingData.email)) {
            newErrors.email = 'Invalid';
        }
        if (!shippingData.address.trim()) newErrors.address = 'Required';
        if (!shippingData.phone.trim()) newErrors.phone = 'Required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (items.length === 0 && !loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mb-8 border border-gray-100 shadow-inner"
                >
                    <ShoppingBag className="h-12 w-12 text-gray-200" />
                </motion.div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Curation is empty</h1>
                <p className="text-gray-400 mb-10 max-w-md text-lg leading-relaxed font-medium">
                    Your collection is currently empty. Discover our latest artifacts to proceed.
                </p>
                <Link href="/shop">
                    <Button className="rounded-[2rem] px-10 h-16 bg-black text-white hover:bg-gray-800 transition-all font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20">
                        Explore Collection
                    </Button>
                </Link>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        if (!validateShipping()) {
            setCurrentStep('shipping');
            addNotification({ type: 'error', message: 'Please correct the delivery coordinates.' });
            return;
        }

        if (!agreedToTerms) {
            addNotification({ type: 'error', message: 'Authorization of terms is required.' });
            return;
        }

        setLoading(true);
        try {
            const orderPayload = {
                items: items.map(item => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    name: item.product.name,
                    variantName: item.variant?.name,
                    sku: item.variant?.sku || item.product.sku,
                    quantity: item.quantity,
                    price: item.variant?.priceAdjustment ? (item.product.salePrice || item.product.basePrice) + item.variant.priceAdjustment : (item.product.salePrice || item.product.basePrice),
                })),
                guestEmail: shippingData.email,
                guestPhone: shippingData.phone,
                guestName: `${shippingData.firstName} ${shippingData.lastName}`,
                guestAddress: {
                    addressLine1: shippingData.address,
                    city: shippingData.city,
                    country: 'Bangladesh',
                },
                paymentMethod,
                subtotal,
                shippingCost: shipping,
                taxAmount: 0,
                discountAmount: discount,
                totalAmount: total,
                userId: user?.id || null,
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            const result = await res.json();

            if (result.success) {
                clearCart();
                addNotification({ type: 'success', message: 'Transaction authorized successfully.' });
                router.push(`/order-success?orderId=${result.data.orderNumber}`);
            } else {
                addNotification({ type: 'error', message: result.error || 'Authorization failed' });
            }
        } catch (error) {
            console.error('Checkout error:', error);
            addNotification({ type: 'error', message: 'Network synchronization error. Please retry.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#fafafa] min-h-screen pb-20 font-sans">
            {/* Minimal High-End Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                        BIG BAZAR<span className="text-indigo-600">.</span>
                    </Link>

                    {/* Stepper Logic Upgrade */}
                    <div className="hidden md:flex items-center gap-12">
                        {steps.map((step, idx) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = steps.findIndex(s => s.id === currentStep) > idx;

                            return (
                                <div key={step.id} className="flex items-center gap-4 group relative">
                                    <div className={`w-10 h-10 rounded-[1.25rem] flex items-center justify-center text-[11px] font-black tracking-widest transition-all ${isActive ? 'bg-black text-white shadow-xl shadow-black/10 scale-110' :
                                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-300 border border-gray-100'
                                        }`}>
                                        {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-black' : 'text-gray-300'}`}>
                                        {step.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="stepIndicator"
                                            className="absolute -bottom-6 left-0 right-0 h-0.5 bg-black"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                        <Lock className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Secured Channel</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Interaction Flow Area */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* 01. Shipping Protocol */}
                        <motion.section
                            initial={false}
                            animate={{ opacity: currentStep === 'shipping' ? 1 : 0.4 }}
                            className={`bg-white rounded-[3rem] p-8 lg:p-12 border border-gray-100 shadow-sm overflow-hidden relative ${currentStep === 'shipping' ? 'shadow-2xl shadow-black/5 ring-1 ring-black/5' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-10">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-[2rem] flex items-center justify-center transition-colors ${currentStep === 'shipping' ? 'bg-black text-white' : 'bg-gray-50 text-gray-300'}`}>
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Protocol 01</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Delivery Destination Coordinates</p>
                                    </div>
                                </div>
                                {currentStep !== 'shipping' && (
                                    <Button variant="ghost" onClick={() => setCurrentStep('shipping')} className="h-12 w-12 rounded-2xl hover:bg-gray-50 border border-gray-100">
                                        <ChevronRight className="h-5 w-5 text-indigo-500" />
                                    </Button>
                                )}
                            </div>

                            <AnimatePresence>
                                {currentStep === 'shipping' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-8 overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label htmlFor="firstName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">First Identification</label>
                                                <input
                                                    id="firstName"
                                                    type="text"
                                                    value={shippingData.firstName}
                                                    onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                                                    className={`w-full px-6 py-5 bg-gray-50 border ${errors.firstName ? 'border-rose-500' : 'border-gray-50'} rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black transition-all text-sm font-black tracking-tight placeholder:text-gray-300`}
                                                    placeholder="GIVEN_NAME"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label htmlFor="lastName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Last Identification</label>
                                                <input
                                                    id="lastName"
                                                    type="text"
                                                    value={shippingData.lastName}
                                                    onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                                                    className={`w-full px-6 py-5 bg-gray-50 border ${errors.lastName ? 'border-rose-500' : 'border-gray-50'} rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black transition-all text-sm font-black tracking-tight placeholder:text-gray-300`}
                                                    placeholder="FAMILY_NAME"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Sync Channel (Email)</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={shippingData.email}
                                                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                                                    className={`w-full px-6 py-5 bg-gray-50 border ${errors.email ? 'border-rose-500' : 'border-gray-50'} rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black transition-all text-sm font-black tracking-tight placeholder:text-gray-300`}
                                                    placeholder="COMMUNICATION@DOMAIN.COM"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-3">
                                                <label htmlFor="address" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Physical Location (Address)</label>
                                                <input
                                                    id="address"
                                                    type="text"
                                                    value={shippingData.address}
                                                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                                    placeholder="STREET, BUILDING, SUITE..."
                                                    className={`w-full px-6 py-5 bg-gray-50 border ${errors.address ? 'border-rose-500' : 'border-gray-50'} rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black transition-all text-sm font-black tracking-tight placeholder:text-gray-300`}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label htmlFor="city" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">District / Hub</label>
                                                <div className="relative">
                                                    <select
                                                        id="city"
                                                        value={shippingData.city}
                                                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black transition-all text-sm font-black tracking-tight appearance-none"
                                                    >
                                                        {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map(city => (
                                                            <option key={city} value={city}>{city.toUpperCase()}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-gray-300 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label htmlFor="phone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Terminal ID (Phone)</label>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    value={shippingData.phone}
                                                    onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                                    placeholder="+880 1XXX XXXXXX"
                                                    className={`w-full px-6 py-5 bg-gray-50 border ${errors.phone ? 'border-rose-500' : 'border-gray-50'} rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white focus:border-black transition-all text-sm font-black tracking-tight placeholder:text-gray-300`}
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-6 flex justify-end">
                                            <Button
                                                onClick={() => { if (validateShipping()) setCurrentStep('payment'); }}
                                                className="bg-black text-white hover:bg-gray-800 rounded-2xl px-12 h-16 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 group"
                                            >
                                                Authorize & Proceed <ArrowLeft className="h-4 w-4 ml-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {currentStep !== 'shipping' && (
                                <div className="pl-20 mt-2 text-sm">
                                    <p className="font-black text-gray-900 tracking-tight uppercase">{shippingData.firstName} {shippingData.lastName}</p>
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{shippingData.address}, {shippingData.city}</p>
                                </div>
                            )}
                        </motion.section>

                        {/* 02. Payment Protocol */}
                        <motion.section
                            animate={{ opacity: currentStep === 'payment' ? 1 : currentStep === 'review' ? 0.4 : 0.2 }}
                            className={`bg-white rounded-[3rem] p-8 lg:p-12 border border-gray-100 shadow-sm overflow-hidden relative ${currentStep === 'payment' ? 'shadow-2xl shadow-black/5 ring-1 ring-black/5' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-10">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-[2rem] flex items-center justify-center transition-colors ${currentStep === 'payment' ? 'bg-black text-white' : 'bg-gray-50 text-gray-300'}`}>
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Protocol 02</h2>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Instrument of Transaction</p>
                                    </div>
                                </div>
                                {currentStep === 'review' && (
                                    <Button variant="ghost" onClick={() => setCurrentStep('payment')} className="h-12 w-12 rounded-2xl hover:bg-gray-50 border border-gray-100">
                                        <ChevronRight className="h-5 w-5 text-indigo-500" />
                                    </Button>
                                )}
                            </div>

                            <AnimatePresence>
                                {currentStep === 'payment' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-6 overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                { id: 'BKASH', name: 'bKash Wallet', sub: 'Instant Sync', color: 'bg-[#E2136E]', icon: 'bK' },
                                                { id: 'NAGAD', name: 'Nagad Wallet', sub: 'Instant Sync', color: 'bg-[#F14105]', icon: 'Na' },
                                                { id: 'CASH_ON_DELIVERY', name: 'Cash on Arrival', sub: 'Protocol Default', color: 'bg-black', icon: '৳' },
                                            ].map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    aria-pressed={paymentMethod === method.id}
                                                    className={`relative flex items-center p-6 rounded-[2rem] border transition-all cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-black group ${paymentMethod === method.id ? 'border-black bg-gray-50/50 shadow-xl shadow-black/5 ring-1 ring-black/5' : 'border-gray-50 hover:border-gray-200 bg-white'}`}
                                                >
                                                    <div className={`w-12 h-12 ${method.color} rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg mr-5`}>
                                                        {method.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="font-black text-gray-900 text-[11px] uppercase tracking-widest block mb-1">{method.name}</span>
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest opacity-50">{method.sub}</span>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-black bg-black' : 'border-gray-100'}`}>
                                                        {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="pt-8 flex items-center justify-between">
                                            <Button variant="ghost" onClick={() => setCurrentStep('shipping')} className="px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black">
                                                Coordinate Adjust
                                            </Button>
                                            <Button
                                                onClick={() => setCurrentStep('review')}
                                                className="bg-black text-white hover:bg-gray-800 rounded-2xl px-12 h-16 text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 group"
                                            >
                                                Final Assessment <ArrowLeft className="h-4 w-4 ml-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {currentStep === 'review' && (
                                <div className="pl-20 mt-2 flex items-center gap-3">
                                    <span className="font-black text-[11px] text-gray-900 uppercase tracking-widest">{paymentMethod.replace(/_/g, ' ')} / Authorized</span>
                                    <Sparkles className="h-3 w-3 text-indigo-500" />
                                </div>
                            )}
                        </motion.section>

                        {/* 03. Review & Validate */}
                        <motion.section
                            animate={{ opacity: currentStep === 'review' ? 1 : 0.2 }}
                            className={`bg-white rounded-[3rem] p-8 lg:p-12 border border-gray-100 shadow-sm overflow-hidden relative ${currentStep === 'review' ? 'shadow-2xl shadow-black/5 ring-1 ring-black/5' : ''}`}
                        >
                            <div className="flex items-center gap-6 mb-10">
                                <div className={`w-14 h-14 rounded-[2rem] flex items-center justify-center transition-colors ${currentStep === 'review' ? 'bg-black text-white' : 'bg-gray-50 text-gray-300'}`}>
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Protocol 03</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Final Authorization & Execution</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {currentStep === 'review' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-10 overflow-hidden"
                                    >
                                        <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[5rem] group-hover:scale-110 transition-transform" />
                                            <div className="relative z-10 space-y-6">
                                                <div className="flex items-center gap-3 text-emerald-400">
                                                    <ShieldCheck className="h-6 w-6" />
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Authorized Execution</h4>
                                                </div>
                                                <p className="text-xl text-gray-300 font-medium leading-relaxed">
                                                    Authorizing the acquisition of <span className="text-white font-black">{items.length} artifacts</span> for total value of <span className="text-white font-black">{formatPrice(total)}</span>. Estimated deployment to <span className="text-white font-black">{shippingData.city} hub</span> is active.
                                                </p>
                                            </div>
                                        </div>

                                        <label className="flex items-start gap-5 cursor-pointer p-8 bg-gray-50 rounded-[2rem] border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-black/5">
                                            <div className="relative mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={agreedToTerms}
                                                    onChange={(event) => setAgreedToTerms(event.target.checked)}
                                                    className="peer appearance-none w-6 h-6 rounded-xl border-2 border-gray-200 checked:bg-black checked:border-black transition-all cursor-pointer"
                                                />
                                                <CheckCircle2 className="absolute inset-0 m-auto h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Authorize Transaction Terms</p>
                                                <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-wider">
                                                    By validating, you authenticate our <Link href="/terms" className="text-indigo-600 underline">Terms of Acquisition</Link> and <Link href="/privacy" className="text-indigo-600 underline">Data Privacy Protocols</Link>.
                                                </p>
                                            </div>
                                        </label>

                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <Button variant="ghost" onClick={() => setCurrentStep('payment')} className="px-10 h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black">
                                                Modify Instrument
                                            </Button>
                                            <Button
                                                disabled={loading || !agreedToTerms}
                                                onClick={handlePlaceOrder}
                                                className="flex-1 w-full bg-black text-white hover:bg-gray-800 rounded-3xl h-24 text-[13px] font-black uppercase tracking-[0.3em] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
                                            >
                                                <AnimatePresence mode="wait">
                                                    {loading ? (
                                                        <motion.div key="loading" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-3">
                                                            <Loader2 className="h-6 w-6 animate-spin" />
                                                            SYNCHRONIZING...
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div key="idle" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-3">
                                                            EXECUTE TRANSACTION / {formatPrice(total)}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>
                    </div>

                    {/* Sidebar - Curation Manifest */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white rounded-[3rem] p-8 lg:p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] group-hover:scale-110 transition-transform -mr-8 -mt-8" />

                                <div className="flex items-center gap-3 mb-10">
                                    <Package className="h-5 w-5 text-indigo-500" />
                                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Curation Manifest</h3>
                                </div>

                                <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                                    {items.map((item) => {
                                        const itemPrice = item.variant?.priceAdjustment
                                            ? (item.product.salePrice || item.product.basePrice) + item.variant.priceAdjustment
                                            : (item.product.salePrice || item.product.basePrice);

                                        return (
                                            <div key={`${item.productId}-${item.variantId}`} className="flex gap-6 group">
                                                <div className="w-20 aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-50 relative">
                                                    <Image
                                                        src={item.product.images?.[0]?.url || '/placeholder.jpg'}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 py-1">
                                                    <h4 className="font-black text-sm text-gray-900 line-clamp-2 mb-2 leading-tight tracking-tight uppercase">{item.product.name}</h4>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className="text-[8px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">QTY: {item.quantity}</span>
                                                        {item.variant && (
                                                            <span className="text-[8px] font-black uppercase text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{item.variant.name}</span>
                                                        )}
                                                    </div>
                                                    <span className="font-black text-sm text-gray-900 font-mono tracking-tighter">{formatPrice(itemPrice * item.quantity)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-4 pt-8 border-t border-gray-50">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Initial Value</span>
                                        <span className="text-gray-900 font-mono">{formatPrice(subtotal)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                            <span>Adjustment</span>
                                            <span className="font-mono">-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Logistics</span>
                                        <span className={`font-mono ${shipping === 0 ? "text-indigo-600" : "text-gray-900"}`}>
                                            {shipping === 0 ? "COMPLIMENTARY" : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    <div className="pt-8 border-t border-dashed border-gray-200 mt-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Authenticated Total</p>
                                                <h4 className="text-3xl font-black text-gray-900 tracking-tighter font-mono">{formatPrice(total)}</h4>
                                            </div>
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-200">
                                                <ShieldCheck className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 rounded-[2.5rem] p-8 flex gap-5 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-[4rem] group-hover:scale-110 transition-transform" />
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0 relative z-10">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Express Dispatch Active</p>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Secure logistics hubs are ready for manifest execution within 24 hours.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
