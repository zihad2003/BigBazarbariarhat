'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { 
    CheckCircle2, 
    Package, 
    Truck, 
    Calendar, 
    ArrowLeft, 
    ShoppingBag, 
    Download, 
    Printer,
    MapPin,
    CreditCard,
    ShieldCheck,
    Clock,
    RefreshCcw,
    XCircle,
    ChevronRight,
    Map,
    Headphones
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';
import { MOCK_ORDERS } from '@/lib/mock-data/orders';

const STATUS_CONFIG: Record<string, { color: string, bg: string, icon: any, label: string }> = {
    placed:           { color: 'text-neutral-500',  bg: 'bg-neutral-100',  icon: Clock,         label: 'Order Placed'   },
    pending:          { color: 'text-amber-700',    bg: 'bg-amber-50',     icon: Clock,         label: 'Pending'        },
    processing:       { color: 'text-blue-700',     bg: 'bg-blue-50',      icon: RefreshCcw,    label: 'Processing'     },
    shipped:          { color: 'text-orange-700',   bg: 'bg-orange-50',    icon: Truck,         label: 'Shipped'        },
    delivered:        { color: 'text-emerald-700',  bg: 'bg-emerald-50',   icon: CheckCircle2,  label: 'Delivered'      },
    cancelled:        { color: 'text-rose-700',     bg: 'bg-rose-50',      icon: XCircle,       label: 'Cancelled'      },
    out_for_delivery: { color: 'text-indigo-700',   bg: 'bg-indigo-50',    icon: Map,           label: 'Out for Delivery'},
};

const TIMELINE_STEPS = [
    { id: 'placed',     label: 'Placed',      icon: Clock        },
    { id: 'pending',    label: 'Confirmed',   icon: ShieldCheck  },
    { id: 'processing', label: 'Processing',  icon: Package      },
    { id: 'shipped',    label: 'Shipped',     icon: Truck        },
    { id: 'delivered',  label: 'Delivered',   icon: CheckCircle2 },
];

const STEP_ORDER = ['placed', 'pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
    const params   = useParams();
    const router   = useRouter();
    const orderId  = params.orderId as string;
    const [order, setOrder]     = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const local = JSON.parse(localStorage.getItem('bigbazar-orders') || '[]');
        const all   = [...MOCK_ORDERS, ...local];
        const found = all.find((o: any) =>
            o.id === orderId || o.id === `ORD-${orderId}` || o.id === `BBB-${orderId}`
        );
        if (found) setOrder(found);
        setIsLoaded(true);
    }, [orderId]);

    /* ── Invoice helpers ─────────────────────────────────────── */
    const handlePrint = () => {
        if (!order) return;
        const win = window.open('', '_blank', 'width=800,height=900');
        if (!win) { alert('Please allow pop-ups to print invoices.'); return; }

        const rows = order.items.map((item: any) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;">${item.name}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;">${item.quantity}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;">৳ ${item.price.toLocaleString()}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:700;">৳ ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>`).join('');

        const a = order.shippingAddress;
        win.document.write(`<!DOCTYPE html><html><head>
          <title>Invoice #${order.id} — Big Bazar Bariarhat</title>
          <style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:-apple-system,'Segoe UI',sans-serif;color:#171717;padding:40px;max-width:800px;margin:0 auto}
            .hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #171717}
            .brand{font-size:22px;font-weight:900;letter-spacing:-.5px;text-transform:uppercase}
            .brand-sub{font-size:10px;color:#a3a3a3;font-weight:500;margin-top:4px;letter-spacing:2px;text-transform:uppercase}
            .inv-lbl{font-size:28px;font-weight:900;text-align:right;letter-spacing:-1px;text-transform:uppercase}
            .inv-id{font-size:11px;color:#a3a3a3;font-weight:600;text-align:right;margin-top:4px}
            .meta{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px}
            .mb h4{font-size:9px;font-weight:700;color:#a3a3a3;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}
            .mb p{font-size:13px;line-height:1.6}
            table{width:100%;border-collapse:collapse;margin-bottom:24px}
            th{font-size:9px;font-weight:700;color:#a3a3a3;text-transform:uppercase;letter-spacing:1.5px;padding:8px 0;border-bottom:2px solid #171717;text-align:left}
            th:nth-child(2){text-align:center}
            th:nth-child(3),th:nth-child(4){text-align:right}
            .tots{margin-left:auto;width:260px}
            .row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px}
            .row.tot{font-weight:900;font-size:18px;border-top:2px solid #171717;padding-top:12px;margin-top:8px}
            .ft{margin-top:48px;padding-top:20px;border-top:1px solid #e5e5e5;text-align:center;font-size:10px;color:#a3a3a3}
            @media print{body{padding:20px}}
          </style></head><body>
          <div class="hd">
            <div><div class="brand">Big Bazar</div><div class="brand-sub">Bariarhat · Since 2024</div></div>
            <div><div class="inv-lbl">Invoice</div><div class="inv-id">#${order.id} · ${new Date(order.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</div></div>
          </div>
          <div class="meta">
            <div class="mb"><h4>Ship To</h4><p><strong>${a.fullName}</strong><br/>${a.address}<br/>${a.upazila}, ${a.district}<br/>${a.division}<br/>Phone: ${a.phone}</p></div>
            <div class="mb" style="text-align:right"><h4>Payment</h4><p>${order.paymentMethod}</p><h4 style="margin-top:16px">Status</h4><p style="text-transform:capitalize">${order.status}</p></div>
          </div>
          <table><thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table>
          <div class="tots">
            <div class="row"><span>Subtotal</span><span>৳ ${order.subtotal.toLocaleString()}</span></div>
            <div class="row"><span>Shipping</span><span>${order.shippingCost === 0 ? 'Free' : '৳ '+order.shippingCost.toLocaleString()}</span></div>
            ${order.discount > 0 ? `<div class="row"><span>Discount</span><span style="color:#dc2626">-৳ ${order.discount.toLocaleString()}</span></div>` : ''}
            <div class="row tot"><span>Total</span><span>৳ ${order.total.toLocaleString()}</span></div>
          </div>
          <div class="ft">Thank you for shopping with Big Bazar Bariarhat.<br/>Questions? support@bigbazar.com</div>
        </body></html>`);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 300);
    };

    const handleDownload = () => {
        alert(`PDF download coming soon!\nAPI endpoint: /api/orders/invoice/${orderId}`);
    };

    /* ── Loading / not found ─────────────────────────────────── */
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
                <div className="w-20 h-20 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-300 mb-6 border border-neutral-100">
                    <ShoppingBag className="h-9 w-9" />
                </div>
                <h1 className="text-2xl font-black text-neutral-900 mb-3 tracking-tight uppercase">Order Not Found</h1>
                <p className="text-neutral-400 text-sm font-medium mb-8 max-w-xs">We couldn't locate an order with the provided ID.</p>
                <Link href="/account/orders">
                    <Button className="rounded-xl px-8 h-11 bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-[10px] uppercase tracking-widest">
                        Back to Orders
                    </Button>
                </Link>
            </div>
        );
    }

    const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
    const StatusIcon = statusCfg.icon;
    const currentStepIdx = STEP_ORDER.indexOf(order.status);

    return (
        <div className="bg-white min-h-screen pb-24 font-sans">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 lg:py-14">

                {/* ── Top bar ──────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <button
                        onClick={() => router.push('/account/orders')}
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleDownload}
                            className="rounded-xl h-10 px-5 text-[10px] font-bold uppercase tracking-widest border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-all gap-2"
                        >
                            <Download className="h-3.5 w-3.5" /> Download Invoice
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="rounded-xl h-10 px-5 text-[10px] font-bold uppercase tracking-widest border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-all gap-2"
                        >
                            <Printer className="h-3.5 w-3.5" /> Print Invoice
                        </Button>
                    </div>
                </div>

                {/* ── Status Hero card ─────────────────────────────── */}
                <section className="bg-neutral-50 rounded-xl border border-neutral-100 p-8 mb-8">

                    {/* Order ID + status + meta */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl font-black text-neutral-900 tracking-tight">#{order.id}</h1>
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest",
                                    statusCfg.bg, statusCfg.color
                                )}>
                                    <StatusIcon className="h-3 w-3" />
                                    {statusCfg.label}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <ShoppingBag className="h-3.5 w-3.5" />
                                    {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-600">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Payment Verified
                                </span>
                            </div>
                        </div>

                        <div className="lg:text-right">
                            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-4xl font-black text-neutral-900 tracking-tight">{formatPrice(order.total)}</p>
                        </div>
                    </div>

                    {/* ── Delivery Timeline ── */}
                    <div className="pt-6 border-t border-neutral-100">
                        <div className="relative flex items-start justify-between">
                            {/* Connecting line track */}
                            <div className="absolute top-5 left-5 right-5 h-[2px] bg-neutral-200" />
                            {/* Animated progress fill */}
                            <motion.div
                                className="absolute top-5 left-5 h-[2px] bg-neutral-900"
                                initial={{ width: 0 }}
                                animate={{ width: currentStepIdx <= 0 ? '0%' : `${(currentStepIdx / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                                transition={{ duration: 1.2, ease: 'easeOut' }}
                            />

                            {TIMELINE_STEPS.map((step, idx) => {
                                const isCompleted = idx <= currentStepIdx;
                                const isCurrent   = idx === currentStepIdx;
                                const stepData    = order.timeline?.find((t: any) => t.status === step.id);

                                return (
                                    <div key={step.id} className="relative flex flex-col items-center gap-2 flex-1">
                                        {/* Icon bubble */}
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center z-10 border-2 transition-all duration-500",
                                            isCompleted
                                                ? "bg-neutral-900 border-neutral-900 text-white"
                                                : "bg-white border-neutral-200 text-neutral-300"
                                        )}>
                                            <step.icon className={cn("h-4 w-4", isCurrent && "animate-pulse")} />
                                        </div>
                                        {/* Label */}
                                        <p className={cn(
                                            "text-[9px] font-black uppercase tracking-widest text-center whitespace-nowrap",
                                            isCompleted ? "text-neutral-900" : "text-neutral-300"
                                        )}>
                                            {step.label}
                                        </p>
                                        {/* Date */}
                                        {stepData?.date && stepData.date !== '' && (
                                            <p className="text-[8px] font-medium text-neutral-400 text-center whitespace-nowrap">
                                                {stepData.date}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ── Lower grid ───────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Order Items */}
                    <div className="lg:col-span-8 space-y-4">
                        <section className="bg-neutral-50 rounded-xl border border-neutral-100 p-6">
                            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-6">Order Items</h3>
                            <div className="space-y-6">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-5 group">
                                        <div className="relative w-20 aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h4 className="text-sm font-black text-neutral-900 uppercase tracking-tight leading-snug group-hover:text-neutral-600 transition-colors">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[10px] font-medium text-neutral-400 mt-1">
                                                        {item.variantId ? `Variant: ${item.variantId}` : 'Standard'}
                                                    </p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-base font-black text-neutral-900 tracking-tight">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-neutral-400 mt-0.5">
                                                        {item.quantity} × {formatPrice(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 pt-3 border-t border-neutral-100 mt-3">
                                                <Button variant="ghost" className="h-8 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900">
                                                    View Product <ChevronRight className="h-3 w-3 ml-1" />
                                                </Button>
                                                <Button variant="ghost" className="h-8 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900">
                                                    Leave Review
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right sidebar */}
                    <div className="lg:col-span-4 space-y-4">

                        {/* Delivery Address */}
                        <section className="bg-neutral-50 rounded-xl border border-neutral-100 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="h-4 w-4 text-neutral-400" />
                                <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Delivery Address</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Recipient</p>
                                    <p className="text-sm font-black text-neutral-900 leading-snug">
                                        {order.shippingAddress.fullName}
                                    </p>
                                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                                        {order.shippingAddress.phone}
                                    </p>
                                </div>
                                <div className="pt-3 border-t border-neutral-100">
                                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Address</p>
                                    <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                                        {order.shippingAddress.address}<br />
                                        {order.shippingAddress.upazila}, {order.shippingAddress.district}<br />
                                        {order.shippingAddress.division}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Payment Summary */}
                        <section className="bg-neutral-50 rounded-xl border border-neutral-100 p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="h-4 w-4 text-neutral-400" />
                                <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Payment</h3>
                            </div>
                            <div className="space-y-3">
                                {/* Method */}
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-[9px] font-black">
                                        {order.paymentMethod.includes('bKash') ? 'bK'
                                            : order.paymentMethod.includes('Nagad') ? 'Na'
                                            : '৳'}
                                    </div>
                                    <p className="text-sm font-bold text-neutral-900">{order.paymentMethod}</p>
                                </div>

                                {/* Breakdown */}
                                <div className="pt-3 border-t border-neutral-100 space-y-2">
                                    <div className="flex justify-between text-xs font-medium text-neutral-500">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-neutral-900">{formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-neutral-500">
                                        <span>Shipping</span>
                                        <span className="font-bold text-neutral-900">
                                            {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
                                        </span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-xs font-medium text-emerald-600">
                                            <span>Discount</span>
                                            <span className="font-bold">−{formatPrice(order.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-3 border-t border-neutral-200 mt-1">
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total</span>
                                        <span className="text-xl font-black text-neutral-900 tracking-tight">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <Button className="w-full h-10 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl text-[10px] font-bold uppercase tracking-widest gap-2">
                                <Headphones className="h-4 w-4" /> Contact Support
                            </Button>
                            {order.status === 'delivered' && (
                                <Button variant="outline" className="w-full h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest border-neutral-200 hover:border-neutral-900 transition-all">
                                    Request Return
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
