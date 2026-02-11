'use client';

import { useState } from 'react';
import {
    Store,
    Globe,
    CreditCard,
    Truck,
    Bell,
    Shield,
    Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-4xl font-black tracking-tight">Settings</h1>
                <p className="text-gray-500 font-medium mt-1">Manage your store configuration</p>
            </div>

            {/* Store Info */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        <Store className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black">Store Information</h2>
                        <p className="text-sm text-gray-400">Basic store details</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Name</label>
                        <Input defaultValue="Big Bazar" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Email</label>
                        <Input defaultValue="support@bigbazar.com" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                        <Input defaultValue="+880 1XXX-XXXXXX" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                        <Input defaultValue="Bariarhat, Mirsharai, Chittagong" className="rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Currency & Locale */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        <Globe className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black">Localization</h2>
                        <p className="text-sm text-gray-400">Currency, language & region</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Currency</label>
                        <select className="w-full h-10 px-4 border rounded-xl bg-white focus:ring-2 focus:ring-black focus:outline-none font-medium">
                            <option value="BDT">BDT (৳) — Bangladeshi Taka</option>
                            <option value="USD">USD ($) — US Dollar</option>
                            <option value="INR">INR (₹) — Indian Rupee</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Default Language</label>
                        <select className="w-full h-10 px-4 border rounded-xl bg-white focus:ring-2 focus:ring-black focus:outline-none font-medium">
                            <option value="en">English</option>
                            <option value="bn">Bengali (বাংলা)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black">Payment Gateways</h2>
                        <p className="text-sm text-gray-400">Configure payment methods</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'Stripe', desc: 'International cards', enabled: true },
                        { name: 'bKash', desc: 'Mobile wallet', enabled: true },
                        { name: 'Nagad', desc: 'Mobile wallet', enabled: false },
                        { name: 'Cash on Delivery', desc: 'Pay on arrival', enabled: true },
                    ].map(gw => (
                        <div key={gw.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <p className="font-bold">{gw.name}</p>
                                <p className="text-xs text-gray-400">{gw.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={gw.enabled} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        <Truck className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black">Shipping</h2>
                        <p className="text-sm text-gray-400">Delivery costs and free shipping threshold</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Standard Shipping Cost (৳)</label>
                        <Input type="number" defaultValue="60" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Free Shipping Threshold (৳)</label>
                        <Input type="number" defaultValue="1500" className="rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        <Bell className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black">Notifications</h2>
                        <p className="text-sm text-gray-400">Email alerts and triggers</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'New Order Notification', enabled: true },
                        { name: 'Low Stock Alert', enabled: true },
                        { name: 'Customer Registration', enabled: false },
                        { name: 'Weekly Sales Report', enabled: true },
                    ].map(n => (
                        <div key={n.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <span className="font-bold text-sm">{n.name}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked={n.enabled} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pt-4">
                <Button
                    onClick={handleSave}
                    className="bg-black text-white rounded-2xl px-12 h-14 font-black text-base hover:scale-105 transition-transform shadow-lg shadow-black/20 gap-2"
                >
                    <Save className="h-5 w-5" />
                    {saved ? 'Saved!' : 'Save Settings'}
                </Button>
                {saved && (
                    <span className="text-green-600 font-bold text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4" /> All changes saved successfully
                    </span>
                )}
            </div>
        </div>
    );
}
