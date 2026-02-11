'use client';

import {
    CreditCard,
    Plus,
    Trash2,
    ShieldCheck,
    Lock,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentsPage() {
    const paymentMethods = [
        {
            id: '1',
            type: 'Visa',
            last4: '4242',
            expiry: '12/26',
            isDefault: true,
            brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg'
        },
        {
            id: '2',
            type: 'MasterCard',
            last4: '8888',
            expiry: '08/25',
            isDefault: false,
            brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
        },
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-4 uppercase tracking-widest">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Financial Hub</h1>
                    <p className="text-gray-500 font-medium mt-2">Manage your authenticated payment instruments and billing preferences.</p>
                </div>

                <Button className="bg-black text-white hover:bg-gray-800 rounded-2xl h-14 px-8 font-bold gap-3 shadow-xl">
                    <Plus className="h-5 w-5" />
                    Archive New Method
                </Button>
            </div>

            <div className="space-y-6">
                {paymentMethods.map((method) => (
                    <div key={method.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-16 bg-gray-50 rounded-xl flex items-center justify-center p-4 border border-gray-100 group-hover:bg-white transition-colors">
                                <img src={method.brandLogo} alt={method.type} className="max-h-full max-w-full" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-black text-gray-900">{method.type} •••• {method.last4}</h3>
                                    {method.isDefault && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">Primary</span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Expires {method.expiry}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {!method.isDefault && (
                                <button className="text-sm font-black text-gray-400 hover:text-black uppercase tracking-widest transition-colors mr-4">
                                    Set as Primary
                                </button>
                            )}
                            <button className="p-4 bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}

                <div className="bg-gray-50 rounded-[2.5rem] p-12 border border-dashed border-gray-200 text-center group hover:bg-white hover:border-black transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <Plus className="h-8 w-8 text-gray-400 group-hover:text-black" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Secure Another Method</h3>
                    <p className="text-gray-500 font-medium">Add a secondary credit or debit instrument for seamless curation.</p>
                </div>
            </div>

            {/* Security Notice */}
            <div className="mt-20 p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <ShieldCheck className="h-10 w-10" />
                </div>
                <div>
                    <h4 className="text-xl font-black text-emerald-900 mb-2 flex items-center gap-2">
                        Bank-Grade Security
                        <Lock className="h-4 w-4" />
                    </h4>
                    <p className="text-emerald-700/70 font-medium leading-relaxed">
                        Big Bazar does not store your full card details. All financial transmissions are handled through encrypted, industry-standard PCI DSS compliant processors. Your data is protected by the highest level of security protocols available.
                    </p>
                </div>
            </div>
        </div>
    );
}
