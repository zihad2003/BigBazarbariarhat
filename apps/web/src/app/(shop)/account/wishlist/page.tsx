'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Trash2, ArrowRight, Star, ShoppingBag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui-store';

export default function AccountWishlistPage() {
    const router = useRouter();
    const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlistStore();
    const { addItem: addToCart } = useCartStore();
    const { openCart, addNotification } = useUIStore();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleOrderNow = (item: any) => {
        addToCart({
            productId: item.productId,
            name: item.name ?? '',
            price: item.price ?? 0,
            image: item.image ?? '',
            quantity: 1,
            stock: 99,
        });
        router.push('/checkout');
    };

    if (!isLoaded) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight uppercase">My Wishlist</h1>
                    <p className="text-neutral-400 text-sm font-medium mt-1">Items you've saved for later.</p>
                </div>
                <div className="bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500 fill-current" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">{wishlistItems.length} Saved Items</span>
                </div>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="bg-neutral-50 rounded-xl p-16 text-center border border-neutral-100">
                    <Heart className="h-10 w-10 text-neutral-200 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight mb-2">Wishlist is Empty</h3>
                    <p className="text-neutral-400 text-sm font-medium max-w-xs mx-auto mb-6">
                        You haven't saved any items yet. Browse our products to find something you love.
                    </p>
                    <Link href="/products">
                        <Button className="rounded-xl px-8 h-10 bg-neutral-900 text-white hover:bg-neutral-800 transition-all font-bold text-[10px] uppercase tracking-widest group">
                            Browse Products <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {wishlistItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group bg-neutral-50 rounded-xl border border-neutral-100 overflow-hidden hover:bg-white hover:border-neutral-200 transition-all"
                            >
                                {/* Image */}
                                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                                    <Image
                                        src={item.image || '/placeholder.jpg'}
                                        alt={item.name ?? 'Product'}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <button
                                            onClick={() => removeFromWishlist(item.productId)}
                                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-rose-500 border border-white hover:bg-rose-50 transition-all"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <Button 
                                            onClick={() => handleOrderNow(item)}
                                            className="w-full bg-neutral-900/90 backdrop-blur-sm text-white rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                        >
                                            <ArrowRight className="h-3.5 w-3.5 mr-2" /> Order Now
                                        </Button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-2">
                                    <h3 className="font-bold text-neutral-900 text-sm tracking-tight group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                                    <div className="flex items-end justify-between">
                                        <span className="text-lg font-black text-neutral-900 tracking-tight">
                                            {formatPrice(item.price ?? 0)}
                                        </span>
                                        <div className="flex items-center gap-1 text-amber-400">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span className="text-[10px] font-bold text-neutral-900">4.8</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Recommendations */}
            {wishlistItems.length > 0 && (
                <div className="pt-8 border-t border-neutral-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">You May Also Like</h3>
                        <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 flex items-center gap-1 transition-colors">
                            View All <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="aspect-[3/4] bg-neutral-100 rounded-xl animate-pulse" />
                                <div className="h-3 w-2/3 bg-neutral-100 rounded animate-pulse" />
                                <div className="h-3 w-1/3 bg-neutral-100 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
