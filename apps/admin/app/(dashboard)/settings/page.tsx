'use client';

import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Truck,
    CreditCard,
    Shield,
    Mail,
    Globe,
    Bell,
    Save,
    Plus,
    Trash2,
    CheckCircle2,
    Loader2,
    Database,
    Palette,
    Lock,
    Languages,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('GENERAL');
    const [settings, setSettings] = useState<any>({});
    const [shippingZones, setShippingZones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [settingsRes, shippingRes] = await Promise.all([
                    fetch('/api/settings'),
                    fetch('/api/settings/shipping')
                ]);
                const settingsResult = await settingsRes.json();
                const shippingResult = await shippingRes.json();

                if (settingsResult.success) setSettings(settingsResult.data);
                if (shippingResult.success) setShippingZones(shippingResult.data);
            } catch (error) {
                console.error('Failed to fetch configurations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const handleSaveGeneral = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Master Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Architecture</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3 italic uppercase">Configure the foundational parameters of the enterprise portal</p>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={handleSaveGeneral}
                        disabled={saving}
                        className="h-16 px-10 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Commit Core Parameters
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Navigation Sidebar */}
                <aside className="lg:w-80 space-y-4">
                    {[
                        { id: 'GENERAL', label: 'Store Identity', icon: SettingsIcon },
                        { id: 'SHIPPING', label: 'Logistics Manifest', icon: Truck },
                        { id: 'PAYMENTS', label: 'Remittance Nodes', icon: CreditCard },
                        { id: 'SECURITY', label: 'Access Protocols', icon: Shield },
                        { id: 'APPEARANCE', label: 'Aesthetic Config', icon: Palette },
                        { id: 'LANGUAGE', label: 'Locale Settings', icon: Languages },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-8 py-6 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 translate-x-4' : 'bg-white text-gray-400 border border-gray-50 hover:bg-gray-100'}`}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Configuration Console */}
                <main className="flex-1">
                    {activeTab === 'GENERAL' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <section className="bg-white rounded-[4rem] border border-gray-100 p-12 shadow-sm">
                                <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tight italic flex items-center gap-4">
                                    <Globe className="h-6 w-6 text-indigo-600" />
                                    Global Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Enterprise Name</label>
                                        <input
                                            className="w-full h-16 px-8 bg-gray-50 border border-transparent rounded-[1.5rem] font-black text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none italic"
                                            value={settings.store_name || ''}
                                            onChange={e => setSettings({ ...settings, store_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Public Intel Email</label>
                                        <input
                                            className="w-full h-16 px-8 bg-gray-50 border border-transparent rounded-[1.5rem] font-bold text-indigo-600 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                                            value={settings.support_email || ''}
                                            onChange={e => setSettings({ ...settings, support_email: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Global Manifest Narrative (Meta Description)</label>
                                        <textarea
                                            rows={4}
                                            className="w-full p-8 bg-gray-50 border border-transparent rounded-[2.5rem] font-medium text-gray-900 focus:bg-white focus:border-indigo-600 transition-all outline-none italic"
                                            value={settings.store_description || ''}
                                            onChange={e => setSettings({ ...settings, store_description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-black rounded-[4rem] p-12 text-white shadow-2xl shadow-black/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-[1.7] transition-transform">
                                    <Lock className="h-40 w-40 text-white" />
                                </div>
                                <h3 className="text-2xl font-black mb-10 border-b border-white/10 pb-8 tracking-tight italic flex items-center gap-4 text-indigo-400">
                                    <CreditCard className="h-6 w-6" />
                                    Transactional Currency
                                </h3>
                                <div className="flex flex-wrap gap-6 relative z-10">
                                    {['BDT', 'USD', 'EUR', 'GBP'].map((curr) => (
                                        <button
                                            key={curr}
                                            onClick={() => setSettings({ ...settings, currency: curr })}
                                            className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${settings.currency === curr ? 'bg-indigo-600 border-indigo-500 scale-110 shadow-xl' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                                        >
                                            {curr}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'SHIPPING' && (
                        <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
                            <div className="flex justify-between items-center bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight italic">Logistics Hub</h3>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">Define geographical fulfillment zones</p>
                                </div>
                                <Button className="h-14 px-8 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-xl shadow-black/20 transform hover:-translate-y-1 transition-all">
                                    <Plus className="h-5 w-5" />
                                    Inject Zone
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {shippingZones.map((zone) => (
                                    <div key={zone.id} className="bg-white rounded-[3.5rem] border border-gray-100 p-10 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all group">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Truck className="h-7 w-7" />
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest text-[8px] font-black">
                                                Active Manifest
                                            </Badge>
                                        </div>
                                        <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic mb-4">{zone.name}</h4>
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {zone.cities.map((city: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 italic">
                                                    {city}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pt-8 border-t border-gray-50 flex justify-between items-center mt-auto">
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">{zone.rates.length} Rate Protocols</span>
                                            <button className="p-3 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-gray-100">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'LANGUAGE' && (
                        <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
                            <section className="bg-white rounded-[4rem] border border-gray-100 p-12 shadow-sm">
                                <h3 className="text-2xl font-black text-gray-900 mb-10 tracking-tight italic flex items-center gap-4">
                                    <Languages className="h-6 w-6 text-indigo-600" />
                                    Default Language Configuration
                                </h3>
                                <p className="text-gray-500 text-sm mb-8 italic">
                                    Define the architectural default language. Manual customer-side toggles are currently operational restricted to ensure brand consistency.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        { code: 'en', name: 'English', flag: '🇬🇧', description: 'English - United States' },
                                        { code: 'bn', name: 'Bengali', flag: '🇧🇩', description: 'বাংলা - Bangladesh' }
                                    ].map((lang) => (
                                        <div
                                            key={lang.code}
                                            onClick={() => setSettings({ ...settings, default_language: lang.code })}
                                            className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${settings.default_language === lang.code
                                                ? 'bg-indigo-50 border-indigo-500 shadow-xl shadow-indigo-500/10'
                                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="text-5xl">{lang.flag}</span>
                                                <div>
                                                    <h4 className="text-2xl font-black text-gray-900 tracking-tight">{lang.name}</h4>
                                                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{lang.code.toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-400 font-medium">{lang.description}</p>
                                            {settings.default_language === lang.code && (
                                                <div className="mt-6 flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Currently Active
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[4rem] p-12 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-10">
                                    <RefreshCw className="h-40 w-40" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                            <Languages className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight italic">Language Toggle Mode</h3>
                                            <p className="text-indigo-200 text-sm uppercase tracking-widest">User Control</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 mt-8">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                            <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-indigo-200">Current Status</h4>
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                                <span className="text-lg font-bold">Disabled</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                            <h4 className="text-xs font-black uppercase tracking-widest mb-3 text-indigo-200">Available Languages</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold">2</span>
                                                <span className="text-indigo-200 text-sm">(EN, BN)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                                        <p className="text-sm text-indigo-100 leading-relaxed">
                                            The storefront currently operates in the default language set above. The manual language toggle has been disabled to ensure a consistent brand experience as per administration policy.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
