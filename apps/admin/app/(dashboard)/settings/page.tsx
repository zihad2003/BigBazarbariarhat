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
    RefreshCw,
    ChevronRight,
    Store
} from 'lucide-react';

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
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const handleSave = async () => {
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

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[13px] text-muted-foreground">Loading settings...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'GENERAL', label: 'General', icon: Store, desc: 'Store info and defaults' },
        { id: 'SHIPPING', label: 'Shipping', icon: Truck, desc: 'Delivery zones and rates' },
        { id: 'PAYMENTS', label: 'Payments', icon: CreditCard, desc: 'Payment gateway setup' },
        { id: 'SECURITY', label: 'Security', icon: Shield, desc: 'Login and data protection' },
        { id: 'APPEARANCE', label: 'Theme', icon: Palette, desc: 'Visual look and feel' },
        { id: 'LANGUAGE', label: 'Language', icon: Languages, desc: 'Language and region' },
    ];

    return (
        <div className="max-w-[1100px] mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Settings</h1>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Manage your store configuration and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save All Changes
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Navigation Sidebar */}
                <aside className="lg:w-64 flex flex-col gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-lg text-left transition-all ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground'}`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                                <span className="text-[13px] font-semibold">{tab.label}</span>
                            </div>
                            <span className={`text-[11px] ml-7 ${activeTab === tab.id ? 'text-primary-foreground/70' : 'text-muted-foreground/60'}`}>{tab.desc}</span>
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <main className="flex-1">
                    {activeTab === 'GENERAL' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    Store Details
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[12px] font-medium text-muted-foreground">Store Name</label>
                                            <input
                                                className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                                value={settings.store_name || ''}
                                                onChange={e => setSettings({ ...settings, store_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[12px] font-medium text-muted-foreground">Support Email</label>
                                            <input
                                                className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                                value={settings.support_email || ''}
                                                onChange={e => setSettings({ ...settings, support_email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[12px] font-medium text-muted-foreground">Store Description (SEO)</label>
                                        <textarea
                                            rows={4}
                                            className="w-full p-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition resize-none"
                                            value={settings.store_description || ''}
                                            onChange={e => setSettings({ ...settings, store_description: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                    Store Currency
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {['BDT', 'USD', 'EUR', 'GBP'].map((curr) => (
                                        <button
                                            key={curr}
                                            onClick={() => setSettings({ ...settings, currency: curr })}
                                            className={`px-6 py-2 rounded-lg text-[12px] font-bold border transition-all ${settings.currency === curr ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-background border-input text-muted-foreground hover:bg-muted/60'}`}
                                        >
                                            {curr}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SHIPPING' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-center bg-card border border-border rounded-xl p-6">
                                <div>
                                    <h2 className="text-sm font-semibold">Shipping Zones</h2>
                                    <p className="text-[12px] text-muted-foreground mt-0.5">Manage where you ship and how much you charge.</p>
                                </div>
                                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold hover:bg-primary/90 transition flex items-center gap-2">
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Zone
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {shippingZones.length === 0 ? (
                                    <div className="col-span-2 text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed border-border">
                                        <Truck className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                                        <p className="text-[13px] text-muted-foreground font-medium">No shipping zones added yet.</p>
                                    </div>
                                ) : (
                                    shippingZones.map((zone) => (
                                        <div key={zone.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                    <Truck className="w-5 h-5" />
                                                </div>
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold border border-emerald-100">
                                                    Active
                                                </span>
                                            </div>
                                            <h4 className="text-[15px] font-bold text-foreground">{zone.name}</h4>
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {zone.cities.map((city: string, i: number) => (
                                                    <span key={i} className="px-2 py-0.5 bg-muted rounded text-[10px] text-muted-foreground font-medium">
                                                        {city}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="pt-4 mt-6 border-t border-border flex justify-between items-center">
                                                <span className="text-[11px] text-muted-foreground">{zone.rates.length} Rates</span>
                                                <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'PAYMENTS' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                    Payment Methods
                                </h2>
                                <div className="space-y-3">
                                    {['Stripe', 'SSLCommerz', 'Cash on Delivery'].map((method) => (
                                        <div key={method} className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl hover:border-primary/30 transition">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center border border-border">
                                                    <CreditCard className="w-6 h-6 text-foreground" />
                                                </div>
                                                <div>
                                                    <h4 className="text-[14px] font-bold text-foreground">{method}</h4>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {method === 'Cash on Delivery' ? 'Pay upon receipt' : 'Secure online payment'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                    <span className="text-[11px] font-bold text-emerald-600">Connected</span>
                                                </div>
                                                <button className="px-3 py-1.5 bg-background border border-border rounded-lg text-[11px] font-bold hover:bg-muted/60 transition">
                                                    Setup
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SECURITY' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    Security Protocols
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 bg-muted/20 border border-border rounded-xl">
                                        <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center mb-4 border border-border text-primary">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-[14px] font-bold text-foreground">Two-Factor Auth</h4>
                                        <p className="text-[12px] text-muted-foreground mt-1 mb-4">Add an extra layer of security to your account.</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                                                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-primary rounded-full shadow-sm"></div>
                                            </div>
                                            <span className="text-[11px] font-bold text-primary">Enabled</span>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-muted/20 border border-border rounded-xl">
                                        <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center mb-4 border border-border text-muted-foreground">
                                            <Database className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-[14px] font-bold text-foreground">Data Encryption</h4>
                                        <p className="text-[12px] text-muted-foreground mt-1 mb-4">Your data is secured with AES-256 encryption.</p>
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold border border-emerald-100">
                                            Verified Secure
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'APPEARANCE' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                                    <Palette className="w-4 h-4 text-primary" />
                                    Theme Selection
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['Light', 'Dark', 'System'].map((theme) => (
                                        <div key={theme} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${theme === 'Light' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-muted-foreground/30'}`}>
                                            <div className="w-full aspect-[4/3] bg-muted rounded-lg mb-4 overflow-hidden relative border border-border/50">
                                                {theme === 'Light' && <div className="absolute inset-0 bg-white"></div>}
                                                {theme === 'Dark' && <div className="absolute inset-0 bg-zinc-950"></div>}
                                                {theme === 'System' && <div className="absolute inset-0 bg-gradient-to-br from-white to-zinc-950"></div>}
                                            </div>
                                            <h4 className="text-[13px] font-bold text-center">{theme} Mode</h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'LANGUAGE' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-sm font-semibold mb-6 flex items-center gap-2">
                                    <Languages className="w-4 h-4 text-primary" />
                                    Default Language
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { code: 'en', name: 'English', flag: '🇬🇧', desc: 'United States' },
                                        { code: 'bn', name: 'Bengali', flag: '🇧🇩', desc: 'Bangladesh' }
                                    ].map((lang) => (
                                        <div
                                            key={lang.code}
                                            onClick={() => setSettings({ ...settings, default_language: lang.code })}
                                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${settings.default_language === lang.code
                                                ? 'bg-primary/5 border-primary'
                                                : 'bg-muted/20 border-border hover:border-muted-foreground/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-3xl">{lang.flag}</span>
                                                <div>
                                                    <h4 className="text-[15px] font-bold text-foreground">{lang.name}</h4>
                                                    <p className="text-[11px] text-muted-foreground uppercase font-mono">{lang.code}</p>
                                                </div>
                                            </div>
                                            <p className="text-[12px] text-muted-foreground">{lang.desc}</p>
                                            {settings.default_language === lang.code && (
                                                <div className="mt-4 flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-wider">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Default Language
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-primary text-primary-foreground rounded-xl p-6 shadow-lg shadow-primary/20 relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <Languages className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <RefreshCw className="w-5 h-5" />
                                        <h3 className="text-[15px] font-bold">Manual Switcher</h3>
                                    </div>
                                    <p className="text-[13px] text-primary-foreground/80 leading-relaxed mb-6">
                                        Allow customers to manually switch languages on the storefront. Currently restricted to ensure consistent brand experience.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                                            <p className="text-[10px] uppercase font-bold text-primary-foreground/60 mb-0.5">Status</p>
                                            <p className="text-[13px] font-bold">Disabled</p>
                                        </div>
                                        <div className="px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                                            <p className="text-[10px] uppercase font-bold text-primary-foreground/60 mb-0.5">Supported</p>
                                            <p className="text-[13px] font-bold">EN, BN</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
