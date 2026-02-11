'use client';

import {
    MapPin,
    Plus,
    Edit2,
    Trash2,
    Check,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AddressesPage() {
    const addresses = [
        {
            id: '1',
            label: 'Home',
            name: 'Zihadul Islam',
            phone: '+880 1712-345678',
            address: 'House 123, Road 4, Section 6',
            city: 'Dhaka',
            zip: '1216',
            isDefault: true
        },
        {
            id: '2',
            label: 'Office',
            name: 'Zihadul Islam',
            phone: '+880 1812-345678',
            address: 'Level 4, BDBL Bhaban, Karwan Bazar',
            city: 'Dhaka',
            zip: '1215',
            isDefault: false
        },
    ];

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

                <Button className="bg-black text-white hover:bg-gray-800 rounded-2xl px-8 h-14 font-bold gap-3 shadow-xl shadow-black/10">
                    <Plus className="h-5 w-5" />
                    Add New Address
                </Button>
            </div>

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
                                <h3 className="text-2xl font-black text-gray-900">{addr.label}</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{addr.city}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</span>
                                <span className="font-bold text-gray-900 text-lg">{addr.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</span>
                                <span className="font-bold text-gray-900">{addr.phone}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Street Address</span>
                                <span className="font-bold text-gray-600 leading-relaxed">{addr.address}, {addr.city} - {addr.zip}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-8 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold gap-2 hover:bg-black hover:text-white transition-all">
                                <Edit2 className="h-4 w-4" />
                                Edit
                            </Button>
                            <Button variant="ghost" className="flex-1 rounded-xl h-12 font-bold gap-2 text-red-500 hover:bg-red-50 transition-all">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Add New Address Card */}
                <button className="bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center hover:bg-white hover:border-indigo-200 transition-all group min-h-[400px]">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                        <Plus className="h-10 w-10 text-gray-300 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-xl font-black text-gray-400 group-hover:text-indigo-600">Add New Address</span>
                    <p className="text-sm text-gray-300 font-bold uppercase tracking-widest mt-2">Maximum 5 addresses</p>
                </button>
            </div>
        </div>
    );
}
