'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Plus, Minus, ShoppingBag, Star, Share2, Heart, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import type { Product} from '@bigbazar/shared';
import { useCartStore } from '@bigbazar/shared';
import { formatPrice } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui-store';
import { SocialShare } from './social-share';
import { motion, AnimatePresence } from 'framer-motion';
import { DeliveryInfoModal } from './delivery-info-modal';

interface ProductQuickViewProps {
    product: Product;
}

export function ProductQuickView({ product }: ProductQuickViewProps) {
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();
    const { addNotification, openCart } = useUIStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

    const price = product.salePrice || product.basePrice;
    const isOutOfStock = product.stockQuantity <= 0;
    const discount = product.salePrice
        ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
        : 0;

    const handleAddToCart = async () => {
        setIsAdding(true);
        // Add artificial delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 600));

        addItem(product, quantity);
        addNotification({
            type: 'success',
            message: `${product.name} appended to curation`,
        });
        setIsAdding(false);
        setIsOpen(false);
        openCart();
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    className="opacity-0 translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 bg-white text-black hover:bg-black hover:text-white rounded-2xl shadow-2xl shadow-black/5"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                    aria-label="Quick view"
                >
                    <Plus className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-y-auto bg-white border-l border-gray-50 flex flex-col">
                <div className="flex-1">
                    {/* Visual Section */}
                    <div className="aspect-[4/5] relative bg-gray-50 group/img overflow-hidden">
                        <Image
                            src={product.images?.[0]?.url || '/placeholder.png'}
                            alt={product.name}
                            fill
                            className="object-cover group-hover/img:scale-110 transition-transform duration-1000"
                        />

                        {/* Overlay Badges */}
                        <div className="absolute top-8 left-8 flex flex-col gap-3">
                            {discount > 0 && (
                                <motion.span
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20"
                                >
                                    Limited Offers / -{discount}%
                                </motion.span>
                            )}
                            {isOutOfStock && (
                                <motion.span
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em]"
                                >
                                    Archive Status / Out of Stock
                                </motion.span>
                            )}
                        </div>

                        {/* Top Actions */}
                        <div className="absolute top-8 right-8">
                            <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md border-transparent hover:bg-white text-gray-400 hover:text-black shadow-xl">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-10 space-y-10">
                        {/* Information Header */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                                    {product.category?.name || 'Curated Collection'}
                                </p>
                                <div className="h-px flex-1 bg-gray-100" />
                            </div>

                            <h2 className="text-4xl font-black text-gray-900 leading-none tracking-tight mb-6">
                                {product.name}
                            </h2>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <span className="text-4xl font-black text-gray-900 tracking-tighter font-mono">
                                        {formatPrice(price)}
                                    </span>
                                    {product.salePrice && (
                                        <span className="text-xl text-gray-300 line-through font-bold font-mono">
                                            {formatPrice(product.basePrice)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <div className="flex items-center text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < Math.round(product.averageRating || 0) ? 'fill-current' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {product.reviewCount} Reviews
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Narrative Description */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Provenance & Specs</h4>
                            <p className="text-gray-500 text-lg leading-relaxed font-medium">
                                {product.shortDescription || product.description?.slice(0, 150) + '...'}
                            </p>
                        </div>

                        {/* Interaction Module */}
                        <div className="space-y-6 pt-6 border-t border-gray-50">
                            {!isOutOfStock && (
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Selection Quantity</span>
                                    <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-all disabled:opacity-30"
                                            disabled={quantity <= 1}
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center font-black text-lg text-gray-900">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-all"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <Button
                                    onClick={() => setIsDeliveryModalOpen(true)}
                                    className="w-full h-16 bg-luxury-gold text-luxury-black hover:bg-white transition-all font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl shadow-luxury-gold/20 flex items-center gap-2 group border border-white/10"
                                >
                                    <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    Order Now
                                </Button>

                                <Button
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock || isAdding}
                                    className="w-full h-14 bg-black text-white hover:bg-gray-800 transition-all font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-black/10 group overflow-hidden relative border border-gray-100"
                                >
                                    <AnimatePresence mode="wait">
                                        {isAdding ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Synchronizing...
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="idle"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                {isOutOfStock ? 'Notify Availability' : 'Add to Cart'}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>

                                <Link href={`/products/${product.slug || product.id}`} className="block">
                                    <Button variant="ghost" className="w-full h-14 text-gray-400 hover:text-black uppercase tracking-widest text-[10px] font-black group transition-all">
                                        Examine Full Artifact <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Connection Channels */}
                        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                    <Check className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Authenticity</span>
                            </div>
                            <SocialShare url={typeof window !== 'undefined' ? `${window.location.origin}/products/${product.slug || product.id}` : ''} title={product.name} />
                        </div>
                    </div>
                </div>
                <DeliveryInfoModal
                    isOpen={isDeliveryModalOpen}
                    onClose={() => setIsDeliveryModalOpen(false)}
                    productName={product.name}
                />
            </SheetContent>
        </Sheet>
    );
}
