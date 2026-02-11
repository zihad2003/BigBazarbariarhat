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
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@bigbazar/shared';
import { useUIStore } from '@/lib/stores/ui-store';
import { useUser } from '@clerk/nextjs';

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
    const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');

    const { items, getSubtotal, clearCart } = useCartStore();
    const { addNotification } = useUIStore();

    useEffect(() => {
        if (isLoaded && user) {
            setShippingData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.emailAddresses[0].emailAddress || '',
            }));
        }
    }, [isLoaded, user]);

    const subtotal = getSubtotal();
    const shipping = 60;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    if (items.length === 0 && !loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-40 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <CheckCircle2 className="h-12 w-12 text-gray-200" />
                </div>
                <h1 className="text-4xl font-black mb-4">Your cart is empty</h1>
                <p className="text-gray-500 mb-10 text-lg font-medium">Add some masterpieces to your cart to proceed to checkout.</p>
                <Link href="/shop">
                    <Button className="bg-black text-white hover:bg-gray-800 rounded-2xl px-12 h-16 text-lg font-black shadow-xl shadow-black/10">
                        Explore Collection
                    </Button>
                </Link>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
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
                taxAmount: tax,
                totalAmount: total,
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            const result = await res.json();
            if (result.success) {
                clearCart();
                addNotification({ type: 'success', message: 'Order placed successfully!' });
                router.push(`/order-success?orderId=${result.data.orderNumber}`);
            } else {
                addNotification({ type: 'error', message: result.error || 'Failed to place order' });
            }
        } catch (error) {
            console.error('Checkout error:', error);
            addNotification({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Checkout Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <Link href="/" className="text-3xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                        BIG BAZAR<span className="text-indigo-600">.</span>
                    </Link>
                    <div className="hidden lg:flex items-center gap-12">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${currentStep === step.id ? 'bg-black text-white shadow-xl shadow-black/20' :
                                    steps.findIndex(s => s.id === currentStep) > idx ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {steps.findIndex(s => s.id === currentStep) > idx ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                                </div>
                                <span className={`text-base font-black uppercase tracking-widest ${currentStep === step.id ? 'text-black' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                                {idx < steps.length - 1 && <ChevronRight className="h-5 w-5 text-gray-200 mx-2" />}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100">
                        <Lock className="h-4 w-4 text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">Secure Encrypted</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Checkout Form Area */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Shipping Section */}
                        <div className={`bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm transition-all duration-500 ${currentStep !== 'shipping' ? 'opacity-50 blur-[1px]' : 'ring-2 ring-black shadow-2xl'}`}>
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-black text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                                        <MapPin className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black">Shipping Destination</h2>
                                        <p className="text-gray-500 font-medium">Your masterpieces will be sent here</p>
                                    </div>
                                </div>
                                {currentStep !== 'shipping' && (
                                    <Button variant="ghost" onClick={() => setCurrentStep('shipping')} className="text-indigo-600 font-black text-lg hover:bg-indigo-50 px-6 rounded-2xl">
                                        Change
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">First Name</label>
                                    <input
                                        type="text"
                                        value={shippingData.firstName}
                                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={shippingData.lastName}
                                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-bold"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={shippingData.email}
                                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-bold"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Full Street Address</label>
                                    <input
                                        type="text"
                                        value={shippingData.address}
                                        onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                        placeholder="Flat 4B, House 12, Road 5..."
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">City</label>
                                    <select
                                        value={shippingData.city}
                                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-bold appearance-none bg-[url('/chevron-down.svg')] bg-no-repeat bg-[right_1.5rem_center]"
                                    >
                                        <option value="Dhaka">Dhaka</option>
                                        <option value="Chittagong">Chittagong</option>
                                        <option value="Sylhet">Sylhet</option>
                                        <option value="Rajshahi">Rajshahi</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={shippingData.phone}
                                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                        placeholder="+880 1XXX-XXXXXX"
                                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-bold"
                                    />
                                </div>
                            </div>

                            {currentStep === 'shipping' && (
                                <div className="mt-12 flex justify-end">
                                    <Button
                                        onClick={() => {
                                            if (!shippingData.firstName || !shippingData.address || !shippingData.phone) {
                                                addNotification({ type: 'error', message: 'Please fill in all shipping details' });
                                                return;
                                            }
                                            setCurrentStep('payment');
                                        }}
                                        className="bg-black text-white hover:bg-gray-800 rounded-[1.5rem] px-12 h-16 text-xl font-black shadow-2xl shadow-black/20 group"
                                    >
                                        Payment Method <ChevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Payment Section */}
                        <div className={`bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm transition-all duration-500 ${currentStep !== 'payment' ? 'opacity-50 blur-[1px]' : 'ring-2 ring-black shadow-2xl'}`}>
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-black text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                                        <CreditCard className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black">Payment Gateway</h2>
                                        <p className="text-gray-500 font-medium">Select your preferred transaction method</p>
                                    </div>
                                </div>
                                {currentStep === 'review' && (
                                    <Button variant="ghost" onClick={() => setCurrentStep('payment')} className="text-indigo-600 font-black text-lg hover:bg-indigo-50 px-6 rounded-2xl">
                                        Change
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { id: 'BKASH', name: 'bKash Wallet', sub: 'Fast & Secure', color: 'bg-[#E2136E]', icon: 'bK' },
                                    { id: 'NAGAD', name: 'Nagad Wallet', sub: 'Instant Payment', color: 'bg-[#F14105]', icon: 'Na' },
                                    { id: 'STRIPE', name: 'Credit / Debit Card', sub: 'Visa, Master, Amex', color: 'bg-[#635BFF]', icon: 'CC' },
                                    { id: 'CASH_ON_DELIVERY', name: 'Cash on Delivery', sub: 'Pay when you receive', color: 'bg-black', icon: '৳' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`group relative flex items-center justify-between p-8 rounded-[2rem] border-4 transition-all text-left bg-white ${paymentMethod === method.id ? 'border-black bg-gray-50 scale-[1.02] shadow-xl' : 'border-gray-50 hover:border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 ${method.color} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                                                {method.icon}
                                            </div>
                                            <div>
                                                <span className="font-black text-gray-900 text-lg block">{method.name}</span>
                                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{method.sub}</span>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-4 transition-all ${paymentMethod === method.id ? 'border-black bg-indigo-600 ring-4 ring-indigo-100' : 'border-gray-100'}`} />
                                    </button>
                                ))}
                            </div>

                            {currentStep === 'payment' && (
                                <div className="mt-12 flex items-center justify-between">
                                    <Button variant="ghost" onClick={() => setCurrentStep('shipping')} className="text-gray-400 font-black text-lg gap-2 hover:bg-gray-50 rounded-2xl px-6">
                                        <ArrowLeft className="h-5 w-5" />
                                        Shipping
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentStep('review')}
                                        className="bg-black text-white hover:bg-gray-800 rounded-[1.5rem] px-12 h-16 text-xl font-black shadow-2xl shadow-black/20 group"
                                    >
                                        Review Order <ChevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Review Section */}
                        <div className={`bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm transition-all duration-500 ${currentStep !== 'review' ? 'opacity-50 blur-[1px]' : 'ring-2 ring-black shadow-2xl'}`}>
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 bg-black text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black">Final Confirmation</h2>
                                    <p className="text-gray-500 font-medium">Please verify all details before placing order</p>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 rounded-[2.5rem] space-y-6 border border-gray-100">
                                <div className="flex justify-between items-center text-base">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Payment Method:</span>
                                    <span className="font-black text-gray-900 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">{paymentMethod.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="flex justify-between items-start text-base border-t border-gray-100 pt-6">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Shipping To:</span>
                                    <div className="text-right">
                                        <div className="font-black text-gray-900">{shippingData.firstName} {shippingData.lastName}</div>
                                        <div className="text-gray-500 font-medium max-w-[200px] leading-relaxed mt-1">{shippingData.address}, {shippingData.city}</div>
                                        <div className="text-gray-400 font-bold text-xs mt-1">{shippingData.phone}</div>
                                    </div>
                                </div>
                            </div>

                            {currentStep === 'review' && (
                                <div className="mt-12 space-y-8">
                                    <label className="flex items-start gap-4 cursor-pointer group p-4 bg-indigo-50/30 rounded-2xl border border-indigo-50">
                                        <input type="checkbox" className="mt-1.5 w-6 h-6 rounded-lg border-2 border-indigo-200 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="text-sm text-gray-500 leading-relaxed font-medium">
                                            By clicking "Confirm Order", I agree to Big Bazar's <Link href="/terms" className="text-black font-black underline">Terms of Service</Link>, <Link href="/privacy" className="text-black font-black underline">Privacy Policy</Link> and <Link href="/return" className="text-black font-black underline">Return Policy</Link>.
                                        </span>
                                    </label>
                                    <Button
                                        disabled={loading}
                                        onClick={handlePlaceOrder}
                                        className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-[2rem] h-20 text-2xl font-black shadow-2xl shadow-indigo-500/20 active:scale-[0.98] transition-all"
                                    >
                                        {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : `Confirm Order • ৳${total.toLocaleString()}`}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl group-hover:bg-indigo-50/50 transition-colors" />
                                <h3 className="text-2xl font-black text-gray-900 mb-10 pb-6 border-b border-gray-100 relative">Cart Summary</h3>

                                <div className="space-y-8 mb-12 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar scrollbar-hide">
                                    {items.map((item) => {
                                        const itemPrice = item.variant?.priceAdjustment
                                            ? (item.product.salePrice || item.product.basePrice) + item.variant.priceAdjustment
                                            : (item.product.salePrice || item.product.basePrice);

                                        return (
                                            <div key={`${item.productId}-${item.variantId}`} className="flex gap-6 group/item">
                                                <div className="w-24 h-32 bg-gray-50 rounded-3xl overflow-hidden shrink-0 border border-gray-100 shadow-sm transition-transform group-hover/item:scale-105 duration-500">
                                                    <Image
                                                        src={item.product.images?.[0]?.url || '/placeholder.png'}
                                                        alt={item.product.name}
                                                        width={96}
                                                        height={128}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-center min-w-0 flex-1">
                                                    <h4 className="font-black text-base text-gray-900 truncate mb-1.5 group-hover/item:text-indigo-600 transition-colors">{item.product.name}</h4>
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        {item.variant && (
                                                            <span className="px-2.5 py-1 bg-gray-50 rounded-lg text-[10px] font-black uppercase text-gray-400 border border-gray-100">{item.variant.name}</span>
                                                        )}
                                                        <span className="px-2.5 py-1 bg-indigo-50 rounded-lg text-[10px] font-black uppercase text-indigo-400 border border-indigo-100">Qty: {item.quantity}</span>
                                                    </div>
                                                    <span className="font-black text-xl text-black">৳{(itemPrice * item.quantity).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-5 mb-10 pt-8 border-t border-gray-100">
                                    <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        <span>Basket Total</span>
                                        <span className="text-gray-900 font-black">৳{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        <span>Shipping</span>
                                        <div className="text-right">
                                            <span className="text-gray-900 font-black block">৳{shipping.toLocaleString()}</span>
                                            <span className="text-[10px] text-indigo-400 font-black">Standard Express</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        <span>Est. Tax (5%)</span>
                                        <span className="text-gray-900 font-black">৳{tax.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-8 border-t-4 border-black border-double flex justify-between items-end">
                                        <span className="text-2xl font-black uppercase tracking-tighter">Total Payable</span>
                                        <div className="text-right">
                                            <span className="text-4xl font-black text-black font-serif block">৳{total.toLocaleString()}</span>
                                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 block">BDT Currency</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-900 rounded-[2rem] text-white flex gap-5 group/promo items-center">
                                    <Info className="h-8 w-8 text-indigo-400 shrink-0 group-hover/promo:rotate-12 transition-transform" />
                                    <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                        Guaranteed safe and secure checkout with 256-bit SSL encryption. We protect your payment details.
                                    </p>
                                </div>
                            </div>

                            <Link href="/shop" className="flex items-center justify-center gap-3 text-gray-400 font-black uppercase tracking-widest text-sm hover:text-black transition-colors group">
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-2" />
                                Continue Curating
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
