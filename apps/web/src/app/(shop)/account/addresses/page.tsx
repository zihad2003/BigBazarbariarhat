'use client';

import { useState } from 'react';
import {
    MapPin,
    Plus,
    Edit2,
    Trash2,
    Check,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddressForm } from '@/components/account/address-form';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useUIStore } from '@/lib/stores/ui-store';
import { useUser } from '@clerk/nextjs';

interface Address {
    id: string;
    label: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const { user, isLoaded } = useUser();
    const queryClient = useQueryClient();
    const { addNotification } = useUIStore();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const { data: addresses = [], isLoading } = useQuery({
        queryKey: ['addresses', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const res = await fetch('/api/account/addresses');
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            return result.data as Address[];
        },
        enabled: !!user,
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch('/api/account/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
            setIsSheetOpen(false);
            addNotification({ type: 'success', message: 'Address added successfully' });
        },
        onError: (error: Error) => {
            addNotification({ type: 'error', message: error.message });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await fetch(`/api/account/addresses/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
            setIsSheetOpen(false);
            setEditingAddress(null);
            addNotification({ type: 'success', message: 'Address updated successfully' });
        },
        onError: (error: Error) => {
            addNotification({ type: 'error', message: error.message });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/account/addresses/${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
            addNotification({ type: 'success', message: 'Address deleted successfully' });
        },
        onError: (error: Error) => {
            addNotification({ type: 'error', message: error.message });
        },
    });

    const handleSubmit = async (data: any) => {
        if (editingAddress) {
            await updateMutation.mutateAsync({ id: editingAddress.id, data });
        } else {
            await createMutation.mutateAsync(data);
        }
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsSheetOpen(true);
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsSheetOpen(true);
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-luxury-gold">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest">Loading addresses...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors mb-4 uppercase tracking-widest">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Address Book</h1>
                </div>

                <Sheet open={isSheetOpen} onOpenChange={(open) => {
                    setIsSheetOpen(open);
                    if (!open) setEditingAddress(null);
                }}>
                    <SheetTrigger asChild>
                        <Button onClick={handleAddNew} className="bg-black text-white hover:bg-gray-800 rounded-2xl px-8 h-14 font-bold gap-3 shadow-xl shadow-black/10">
                            <Plus className="h-5 w-5" />
                            Add New Address
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                        <SheetHeader className="mb-8">
                            <SheetTitle className="text-2xl font-black font-playfair">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </SheetTitle>
                        </SheetHeader>
                        <AddressForm
                            initialData={editingAddress ? {
                                ...editingAddress,
                                addressLine2: editingAddress.addressLine2 ?? undefined,
                                state: editingAddress.state ?? undefined,
                                country: editingAddress.country || 'Bangladesh'
                            } : undefined}
                            onSubmit={handleSubmit}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                            buttonLabel={editingAddress ? 'Update Address' : 'Save Address'}
                            onCancel={() => setIsSheetOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl text-gray-300">
                        <MapPin className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No addresses found</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Add a shipping address to speed up your checkout process.</p>
                    <Button onClick={handleAddNew} className="bg-black text-white hover:bg-gray-800 rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-xs">
                        Add Address
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {addresses.map((addr) => (
                        <div key={addr.id} className={`bg-white rounded-[3rem] p-10 border transition-all hover:shadow-2xl relative group ${addr.isDefault ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-xl' : 'border-gray-100 shadow-sm'}`}>
                            {addr.isDefault && (
                                <div className="absolute top-8 right-10 flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    <Check className="h-3 w-3" />
                                    Default
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${addr.isDefault ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <MapPin className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 capitalize">{addr.label}</h3>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{addr.city}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</span>
                                    <span className="font-bold text-gray-900 text-lg">{addr.fullName}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</span>
                                    <span className="font-bold text-gray-900">{addr.phone}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Details</span>
                                    <span className="font-bold text-gray-600 leading-relaxed">
                                        {addr.addressLine1}
                                        {addr.addressLine2 && `, ${addr.addressLine2}`}
                                        <br />
                                        {addr.city}, {addr.postalCode}
                                        <br />
                                        {addr.country}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-8 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="outline"
                                    onClick={() => handleEdit(addr)}
                                    className="flex-1 rounded-xl h-12 font-bold gap-2 hover:bg-black hover:text-white transition-all"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this address?')) {
                                            deleteMutation.mutate(addr.id);
                                        }
                                    }}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 rounded-xl h-12 font-bold gap-2 text-red-500 hover:bg-red-50 transition-all"
                                >
                                    {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Address Card */}
                    <button
                        onClick={handleAddNew}
                        className="bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center hover:bg-white hover:border-indigo-200 transition-all group min-h-[400px]"
                    >
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                            <Plus className="h-10 w-10 text-gray-300 group-hover:text-indigo-600" />
                        </div>
                        <span className="text-xl font-black text-gray-400 group-hover:text-indigo-600">Add New Address</span>
                        <p className="text-sm text-gray-300 font-bold uppercase tracking-widest mt-2">Maximum 5 addresses</p>
                    </button>
                </div>
            )}
        </div>
    );
}
