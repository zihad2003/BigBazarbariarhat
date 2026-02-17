'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    Globe,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BrandsPage() {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/brands');
            const result = await res.json();
            if (result.success) {
                setBrands(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch artifacts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const deleteBrand = async (id: string) => {
        if (!confirm('Are you sure you want to decommission this brand artifact?')) return;
        try {
            const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                fetchBrands();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Termination failed:', error);
        }
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-gray-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Partnerships</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-3 uppercase italic">Curate the global brand manifest within the ecosystem</p>
                </div>
                <Link href="/brands/new">
                    <Button
                        className="h-16 px-10 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-widest gap-3 shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Inject Artifact
                    </Button>
                </Link>
            </div>

            {/* Matrix Console */}
            <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify brand by artifact name or slug..."
                            className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-transparent rounded-2xl text-base focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold placeholder:text-gray-300"
                        />
                    </div>
                </div>
            </div>

            {/* Brands Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {loading ? (
                    [...Array(8)].map((_, i) => (
                        <div key={i} className="h-72 bg-gray-50 rounded-[3.5rem] animate-pulse" />
                    ))
                ) : brands.map((brand) => (
                    <Link key={brand.id} href={`/brands/${brand.id}`}>
                        <div className="bg-white rounded-[3.5rem] border border-gray-100 p-10 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all group relative overflow-hidden flex flex-col items-center text-center h-full cursor-pointer">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[8rem] opacity-30 group-hover:scale-120 transition-transform" />

                            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-lg mb-8 relative z-10 overflow-hidden">
                                {brand.logo ? <img src={brand.logo} alt="" className="w-full h-full object-cover" /> : <Shield className="h-10 w-10 text-indigo-400 group-hover:text-white" />}
                            </div>

                            <div className="space-y-2 mb-8 relative z-10 w-full">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">{brand.name}</h3>
                                <div className="flex items-center justify-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                    <Globe className="h-3 w-3" /> {brand.website || 'Internal Asset'}
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full pt-8 border-t border-gray-50 relative z-10 mt-auto">
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 italic">Manifest Vol.</span>
                                    <span className="text-xl font-black text-indigo-600 italic">#{brand._count?.products || 0}</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-12 h-12 p-0 rounded-2xl border border-gray-100 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all">
                                        <Edit3 className="h-5 w-5" />
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteBrand(brand.id);
                                        }}
                                        className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100 z-20"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
