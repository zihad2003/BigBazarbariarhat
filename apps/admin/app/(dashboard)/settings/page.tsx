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

    // Modal state for adding a shipping zone
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newZoneName, setNewZoneName] = useState('');
    const [newZoneCities, setNewZoneCities] = useState('');
    const [newZoneRates, setNewZoneRates] = useState<any[]>([
        { name: 'Standard Shipping', baseRate: 60, estimatedDays: '2-3 days' }
    ]);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [settingsRes, shippingRes] = await Promise.all([
                    fetch('/api/settings'),
                    fetch('/api/settings/shipping')
                ]);
                if (settingsRes.ok) {
                    const settingsResult = await settingsRes.json();
                    if (settingsResult.success) setSettings(settingsResult.data);
                }

                if (shippingRes.ok) {
                    const shippingResult = await shippingRes.json();
                    if (shippingResult.success) setShippingZones(shippingResult.data);
                } else {
                    setShippingZones([]);
                }
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

    const handleCreateZone = async () => {
        if (!newZoneName.trim()) return;
        try {
            const citiesArray = newZoneCities
                .split(',')
                .map(c => c.trim())
                .filter(Boolean);

            const res = await fetch('/api/settings/shipping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newZoneName,
                    cities: citiesArray,
                    rates: newZoneRates,
                    isActive: true
                })
            });

            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    setShippingZones([result.data, ...shippingZones]);
                    setIsModalOpen(false);
                    // Reset fields
                    setNewZoneName('');
                    setNewZoneCities('');
                    setNewZoneRates([{ name: 'Standard Shipping', baseRate: 60, estimatedDays: '2-3 days' }]);
                }
            }
        } catch (error) {
            console.error('Failed to create zone:', error);
        }
    };

    const handleDeleteZone = async (id: string) => {
        if (!confirm('Are you sure you want to delete this shipping zone?')) return;
        try {
            const res = await fetch(`/api/settings/shipping/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                const result = await res.json();
                if (result.success) {
                    setShippingZones(shippingZones.filter(zone => zone.id !== id));
                }
            }
        } catch (error) {
            console.error('Failed to delete zone:', error);
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
                                    <Bell className="w-4 h-4 text-primary" />
                                    Announcement Bar
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl">
                                        <div>
                                            <h4 className="text-[13px] font-bold text-foreground">Enable Announcement Bar</h4>
                                            <p className="text-[11px] text-muted-foreground">Show or hide the announcement bar at the top of the storefront.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSettings({ ...settings, show_announcement: settings.show_announcement !== false ? false : true })}
                                            className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${settings.show_announcement !== false ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                        >
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${settings.show_announcement !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[12px] font-medium text-muted-foreground">Announcement Text</label>
                                        <input
                                            className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                            value={settings.announcement_text || ''}
                                            onChange={e => setSettings({ ...settings, announcement_text: e.target.value })}
                                            placeholder="Use code BIGBAZAR10 for 10% off..."
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
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold hover:bg-primary/90 transition flex items-center gap-2"
                                >
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
                                        <div key={zone.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                        <Truck className="w-5 h-5" />
                                                    </div>
                                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold border border-emerald-100">
                                                        Active
                                                    </span>
                                                </div>
                                                <h4 className="text-[15px] font-bold text-foreground">{zone.name}</h4>
                                                
                                                <div className="space-y-1 mt-3">
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Cities</span>
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {zone.cities.map((city: string, i: number) => (
                                                            <span key={i} className="px-2 py-0.5 bg-muted rounded text-[10px] text-muted-foreground font-medium">
                                                                {city}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {zone.rates && Array.isArray(zone.rates) && zone.rates.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-border/50 space-y-1.5">
                                                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Rates</span>
                                                        {zone.rates.map((rate: any, i: number) => (
                                                            <div key={i} className="flex justify-between items-center text-[12px] text-muted-foreground">
                                                                <span>{rate.name} {rate.estimatedDays ? `(${rate.estimatedDays})` : ''}</span>
                                                                <span className="font-semibold text-foreground">{rate.baseRate} BDT</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="pt-4 mt-6 border-t border-border flex justify-between items-center">
                                                <span className="text-[11px] text-muted-foreground">{(zone.rates || []).length} Rates</span>
                                                <button 
                                                    onClick={() => handleDeleteZone(zone.id)}
                                                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Shipping Zone Modal */}
                            {isModalOpen && (
                                <div className="fixed inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center z-50 animate-in fade-in duration-200">
                                    <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                                        <div className="p-6 border-b border-border flex justify-between items-center">
                                            <h3 className="text-[15px] font-bold text-foreground">Add Shipping Zone</h3>
                                            <button 
                                                onClick={() => setIsModalOpen(false)} 
                                                className="text-muted-foreground hover:text-foreground text-sm font-semibold transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        
                                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Zone Name</label>
                                                <input
                                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                                    placeholder="e.g. Inside Dhaka"
                                                    value={newZoneName}
                                                    onChange={e => setNewZoneName(e.target.value)}
                                                />
                                            </div>
                                            
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Cities (Comma separated)</label>
                                                <input
                                                    className="w-full h-11 px-4 bg-background border border-input rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-ring transition"
                                                    placeholder="e.g. Dhaka, Savar, Uttara"
                                                    value={newZoneCities}
                                                    onChange={e => setNewZoneCities(e.target.value)}
                                                />
                                            </div>
                                            
                                            <div className="space-y-3 pt-2">
                                                <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Shipping Rates</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewZoneRates([...newZoneRates, { name: '', baseRate: 0, estimatedDays: '' }])}
                                                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" /> Add Rate
                                                    </button>
                                                </div>
                                                
                                                {newZoneRates.map((rate, index) => (
                                                    <div key={index} className="p-4 bg-muted/20 border border-border rounded-lg space-y-3 relative">
                                                        {newZoneRates.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setNewZoneRates(newZoneRates.filter((_, i) => i !== index))}
                                                                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive text-xs transition"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Rate Name</span>
                                                                <input
                                                                    className="w-full h-9 px-3 bg-background border border-input rounded text-[12px] outline-none"
                                                                    placeholder="e.g. Standard Delivery"
                                                                    value={rate.name}
                                                                    onChange={e => {
                                                                        const updated = [...newZoneRates];
                                                                        updated[index].name = e.target.value;
                                                                        setNewZoneRates(updated);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Cost (BDT)</span>
                                                                <input
                                                                    type="number"
                                                                    className="w-full h-9 px-3 bg-background border border-input rounded text-[12px] outline-none"
                                                                    placeholder="e.g. 60"
                                                                    value={rate.baseRate || ''}
                                                                    onChange={e => {
                                                                        const updated = [...newZoneRates];
                                                                        updated[index].baseRate = parseFloat(e.target.value) || 0;
                                                                        setNewZoneRates(updated);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1 col-span-2">
                                                                <span className="text-[10px] text-muted-foreground font-semibold uppercase">Est. Delivery Time</span>
                                                                <input
                                                                    className="w-full h-9 px-3 bg-background border border-input rounded text-[12px] outline-none"
                                                                    placeholder="e.g. 2-3 days"
                                                                    value={rate.estimatedDays}
                                                                    onChange={e => {
                                                                        const updated = [...newZoneRates];
                                                                        updated[index].estimatedDays = e.target.value;
                                                                        setNewZoneRates(updated);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/10">
                                            <button
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-4 py-2 bg-background border border-input rounded-lg text-[12px] font-bold text-muted-foreground hover:bg-muted/60 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleCreateZone}
                                                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-[12px] font-bold hover:bg-primary/90 transition"
                                            >
                                                Save Zone
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
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
