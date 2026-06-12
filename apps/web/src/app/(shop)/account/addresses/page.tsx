'use client';

import { useState, useEffect } from 'react';
import { 
    MapPin, 
    Plus, 
    Home, 
    Briefcase, 
    Trash2, 
    Edit2, 
    X,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Address {
    id: string;
    type: 'Home' | 'Office' | 'Other';
    fullName: string;
    phone: string;
    address: string;
    upazila: string;
    district: string;
    division: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('bigbazar-addresses') || '[]');
        if (saved.length === 0) {
            const mock = [
                {
                    id: '1',
                    type: 'Home' as const,
                    fullName: 'Zihad Islam',
                    phone: '01712345678',
                    address: 'House 12, Road 5, Block B, Mirpur-10',
                    upazila: 'Mirpur',
                    district: 'Dhaka',
                    division: 'Dhaka',
                    isDefault: true
                }
            ];
            setAddresses(mock);
            localStorage.setItem('bigbazar-addresses', JSON.stringify(mock));
        } else {
            setAddresses(saved);
        }
        setIsLoaded(true);
    }, []);

    const saveAddresses = (newAddresses: Address[]) => {
        setAddresses(newAddresses);
        localStorage.setItem('bigbazar-addresses', JSON.stringify(newAddresses));
    };

    const handleDelete = (id: string) => {
        const filtered = addresses.filter(a => a.id !== id);
        if (filtered.length > 0 && addresses.find(a => a.id === id)?.isDefault) {
            filtered[0].isDefault = true;
        }
        saveAddresses(filtered);
    };

    const setAsDefault = (id: string) => {
        const updated = addresses.map(a => ({
            ...a,
            isDefault: a.id === id
        }));
        saveAddresses(updated);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            type: formData.get('type') as any,
            fullName: formData.get('fullName') as string,
            phone: formData.get('phone') as string,
            address: formData.get('address') as string,
            upazila: formData.get('upazila') as string,
            district: formData.get('district') as string,
            division: formData.get('division') as string,
        };

        if (editingAddress) {
            const updated = addresses.map(a => a.id === editingAddress.id ? { ...a, ...data } : a);
            saveAddresses(updated);
        } else {
            const newAddress: Address = {
                id: crypto.randomUUID(),
                ...data,
                isDefault: addresses.length === 0
            };
            saveAddresses([...addresses, newAddress]);
        }
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    if (!isLoaded) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">Saved Addresses</h1>
                    <p className="text-neutral-400 text-sm font-medium mt-1">Manage your shipping addresses for faster checkout.</p>
                </div>
                <Button 
                    onClick={() => { setEditingAddress(null); setIsModalOpen(true); }}
                    className="rounded-xl h-10 px-6 bg-neutral-900 text-white hover:bg-neutral-800 transition-all font-bold text-[10px] uppercase tracking-widest gap-2"
                >
                    <Plus className="h-4 w-4" /> Add New Address
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {addresses.map((address) => (
                        <motion.div
                            key={address.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "bg-neutral-50 rounded-xl p-5 border transition-all",
                                address.isDefault ? "border-neutral-900 ring-1 ring-neutral-900/5" : "border-neutral-100"
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-colors", address.isDefault ? "bg-neutral-900 text-white" : "bg-white text-neutral-400 border border-neutral-100")}>
                                        {address.type === 'Home' ? <Home className="h-4 w-4" /> : address.type === 'Office' ? <Briefcase className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-tight">{address.type}</h3>
                                        {address.isDefault && <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Default</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => { setEditingAddress(address); setIsModalOpen(true); }} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-neutral-300 hover:text-neutral-900 transition-colors border border-neutral-100">
                                        <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(address.id)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-neutral-300 hover:text-rose-500 transition-colors border border-neutral-100">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <p className="text-sm font-bold text-neutral-900">{address.fullName}</p>
                                <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                                    {address.address}<br />
                                    {address.upazila}, {address.district}<br />
                                    {address.division}
                                </p>
                                <p className="text-xs font-bold text-neutral-900 tracking-wider">{address.phone}</p>
                            </div>

                            {!address.isDefault && (
                                <button 
                                    onClick={() => setAsDefault(address.id)}
                                    className="w-full py-2.5 rounded-xl border border-neutral-100 text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 hover:border-neutral-900 transition-all bg-white"
                                >
                                    Set as Default
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {addresses.length === 0 && (
                    <div className="md:col-span-2 py-16 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                        <MapPin className="h-8 w-8 text-neutral-200 mx-auto mb-3" />
                        <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight mb-1">No Addresses Found</h3>
                        <p className="text-neutral-400 text-sm font-medium">Add a shipping address for faster checkout.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white w-full max-w-xl rounded-xl overflow-hidden border border-neutral-100"
                        >
                            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                                <h2 className="text-lg font-black text-neutral-900 tracking-tight uppercase">{editingAddress ? 'Update Address' : 'New Address'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-50 transition-colors">
                                    <X className="h-5 w-5 text-neutral-400" />
                                </button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 flex gap-3">
                                        {['Home', 'Office', 'Other'].map(type => (
                                            <label key={type} className="flex-1 cursor-pointer">
                                                <input type="radio" name="type" value={type} defaultChecked={editingAddress?.type === type || type === 'Home'} className="peer hidden" />
                                                <div className="py-2.5 text-center border border-neutral-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-neutral-400 peer-checked:bg-neutral-900 peer-checked:text-white peer-checked:border-neutral-900 transition-all">
                                                    {type}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Recipient Name</label>
                                        <input name="fullName" required defaultValue={editingAddress?.fullName} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all text-sm font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Phone Number</label>
                                        <input name="phone" required defaultValue={editingAddress?.phone} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all text-sm font-bold" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Street Address</label>
                                        <input name="address" required defaultValue={editingAddress?.address} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all text-sm font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Division</label>
                                        <select name="division" required defaultValue={editingAddress?.division || 'Dhaka'} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all text-sm font-bold appearance-none">
                                            <option>Dhaka</option>
                                            <option>Chittagong</option>
                                            <option>Sylhet</option>
                                            <option>Rajshahi</option>
                                            <option>Khulna</option>
                                            <option>Barisal</option>
                                            <option>Rangpur</option>
                                            <option>Mymensingh</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">District</label>
                                        <input name="district" required defaultValue={editingAddress?.district} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all text-sm font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Upazila / Thana</label>
                                        <input name="upazila" required defaultValue={editingAddress?.upazila} className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all text-sm font-bold" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-11 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                                    Save Address
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
