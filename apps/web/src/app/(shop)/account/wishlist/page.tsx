'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    Heart, 
    ShoppingBag, 
    Trash2, 
    ArrowRight, 
    Star,
    Plus,
    Loader2,
    ChevronRight,
    ShoppingBasket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui-store';

export default function AccountWishlistPage() {
    const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlistStore();
    const { addItem: addToCart } = useCartStore();
    const { openCart, addNotification } = useUIStore();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleAddToCart = (item: any) => {
        addToCart(item, 1);
        addNotification({ type: 'success', message: 'Artifact synchronized with curation.' });
        openCart();
    };

    if (!isLoaded) return null;

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-black" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Personal Gallery</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">My Wishlist</h1>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <Heart className="h-4 w-4 text-rose-500 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{wishlistItems.length} Reserved Pieces</span>
                </div>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100 shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
                        <Heart className="h-10 w-10 text-gray-200" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">Gallery is Empty</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto mb-12 leading-relaxed">
                        You haven't reserved any artifacts yet. Explore our curated collections to discover exceptional pieces.
                    </p>
                    <Link href="/products">
                        <Button className="rounded-2xl px-12 h-16 bg-black text-white hover:bg-gray-800 transition-all font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20 group">
                            Explore Collections <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {wishlistItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-700"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                                    <Image 
                                        src={item.images?.[0]?.url || '/placeholder.jpg'} 
                                        alt={item.name} 
                                        fill 
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                                    />
                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                        <button 
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-rose-500 shadow-lg border border-white hover:bg-rose-50 transition-all group/btn"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <Button 
                                            onClick={() => handleAddToCart(item)}
                                            className="w-full bg-black/90 backdrop-blur-md text-white border border-white/20 rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl"
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Add to Curation
                                        </Button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-black text-gray-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{item.name}</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Ref: {item.sku || 'ART-001'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black text-gray-900 font-mono tracking-tighter">
                                                {formatPrice(item.salePrice || item.basePrice)}
                                            </span>
                                            {item.salePrice && (
                                                <span className="text-[9px] text-gray-400 line-through font-mono">{formatPrice(item.basePrice)}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-[10px] font-black text-gray-900">{item.rating || '4.8'}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Recommendations Section */}
            {wishlistItems.length > 0 && (
                <div className="pt-16 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">You May Also Appreciate</h3>
                        <Link href="/products" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-black flex items-center gap-2 transition-colors">
                            View All Collection <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                    {/* Simplified product row for recommendation */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-60">
                        {/* Mock recommended items */}
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-[3/4] bg-gray-50 rounded-2xl animate-pulse" />
                                <div className="h-3 w-2/3 bg-gray-50 rounded animate-pulse" />
                                <div className="h-4 w-1/3 bg-gray-50 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
