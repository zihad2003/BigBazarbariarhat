'use client';

import { useState, useEffect } from 'react';
import { 
    MapPin, 
    Plus, 
    Home, 
    Briefcase, 
    MoreVertical, 
    Trash2, 
    Edit2, 
    Check,
    AlertCircle,
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
            // Initial mock data if empty
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
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Logistics Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Saved Coordinates</h1>
                </div>
                <Button 
                    onClick={() => { setEditingAddress(null); setIsModalOpen(true); }}
                    className="rounded-2xl h-14 px-8 bg-black text-white hover:bg-gray-800 transition-all font-black text-[11px] uppercase tracking-widest shadow-xl shadow-black/20 gap-3"
                >
                    <Plus className="h-4 w-4" /> Add New Coordinate
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {addresses.map((address) => (
                        <motion.div
                            key={address.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={cn(
                                "group bg-white rounded-[3rem] p-8 border transition-all relative overflow-hidden",
                                address.isDefault ? "border-black shadow-2xl shadow-black/5 ring-1 ring-black/5" : "border-gray-100 shadow-sm"
                            )}
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors", address.isDefault ? "bg-black text-white" : "bg-gray-50 text-gray-400")}>
                                        {address.type === 'Home' ? <Home className="h-5 w-5" /> : address.type === 'Office' ? <Briefcase className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase tracking-tight">{address.type}</h3>
                                        {address.isDefault && <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Primary Hub</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => { setEditingAddress(address); setIsModalOpen(true); }} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 hover:text-black transition-colors">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(address.id)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 hover:text-rose-500 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{address.fullName}</p>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                    {address.address}<br />
                                    {address.upazila}, {address.district}<br />
                                    {address.division}
                                </p>
                                <p className="text-[11px] font-black text-gray-900 tracking-widest">{address.phone}</p>
                            </div>

                            {!address.isDefault && (
                                <button 
                                    onClick={() => setAsDefault(address.id)}
                                    className="w-full py-4 rounded-2xl border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:border-black transition-all"
                                >
                                    Set as Primary Hub
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {addresses.length === 0 && (
                    <div className="md:col-span-2 py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                            <MapPin className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">No Coordinates Found</h3>
                        <p className="text-gray-400 text-sm font-medium">Add a delivery destination to expedite your next acquisition.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{editingAddress ? 'Update Coordinate' : 'New Coordinate'}</h2>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-50 transition-colors">
                                    <X className="h-6 w-6 text-gray-300" />
                                </button>
                            </div>
                            <form onSubmit={handleFormSubmit} className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 flex gap-4">
                                        {['Home', 'Office', 'Other'].map(type => (
                                            <label key={type} className="flex-1 cursor-pointer">
                                                <input type="radio" name="type" value={type} defaultChecked={editingAddress?.type === type || type === 'Home'} className="peer hidden" />
                                                <div className="py-4 text-center border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 peer-checked:bg-black peer-checked:text-white peer-checked:border-black transition-all">
                                                    {type}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">Recipient Name</label>
                                        <input name="fullName" required defaultValue={editingAddress?.fullName} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">Terminal ID (Phone)</label>
                                        <input name="phone" required defaultValue={editingAddress?.phone} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">Physical Location (Address)</label>
                                        <input name="address" required defaultValue={editingAddress?.address} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">Division</label>
                                        <select name="division" required defaultValue={editingAddress?.division || 'Dhaka'} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black appearance-none">
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
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">District</label>
                                        <input name="district" required defaultValue={editingAddress?.district} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">Upazila / Thana</label>
                                        <input name="upazila" required defaultValue={editingAddress?.upazila} className="w-full px-6 py-4 bg-gray-50 border border-gray-50 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-black" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-16 bg-black text-white hover:bg-gray-800 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-black/20">
                                    Authenticate & Save
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
