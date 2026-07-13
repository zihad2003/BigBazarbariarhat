'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, ShoppingBag, Star, Share2, Heart, Check, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import type { Product } from '@/types/product';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui-store';
import { SocialShare } from './social-share';
import { motion, AnimatePresence } from 'framer-motion';
import { DeliveryInfoModal } from './delivery-info-modal';
import { useLanguageStore, useTranslation } from '@bigbazar/shared';
import { t as getTranslation } from '@/lib/i18n/translations';

interface ProductQuickViewProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
    const { language } = useLanguageStore();
    const t = useTranslation();
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();
    const { addNotification } = useUIStore();
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);

    const price = product.salePrice || product.basePrice;
    const isOutOfStock = product.stock <= 0;
    const discount = product.salePrice
        ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
        : 0;

    const handleAddToCart = async () => {
        setIsAdding(true);
        // Add artificial delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 600));

        addItem({
            productId: product.id,
            name: product.name,
            price: product.salePrice ?? product.basePrice,
            image: product.images?.[0]?.url ?? '',
            quantity,
            stock: product.stock,
        });
        setIsAdding(false);
        onClose();
        router.push('/cart');
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
            <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-y-auto bg-white border-l border-gray-50 flex flex-col">
                <div className="flex-1">
                    {/* Visual Section */}
                    <div className="aspect-[4/5] relative bg-gray-50 group/img overflow-hidden">
                        <Image
                            src={(() => {
                                const firstImage = product.images?.[0];
                                return typeof firstImage === 'string' ? firstImage : (firstImage && typeof firstImage === 'object' && 'url' in firstImage ? (firstImage as any).url : '/placeholder.png');
                            })()}
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
                                    {typeof product.category === 'object' ? (product.category as any)?.name : (product.category || 'Curated Collection')}
                                </p>
                                <div className="h-px flex-1 bg-gray-100" />
                            </div>

                            <h2 className="text-4xl font-black text-gray-900 leading-none tracking-tight mb-6">
                                {product.name}
                            </h2>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <span className="text-4xl font-black text-gray-900 tracking-tighter font-mono">
                                        {formatPrice(price, language)}
                                    </span>
                                    {product.salePrice && (
                                        <span className="text-xl text-gray-300 line-through font-bold font-mono">
                                            {formatPrice(product.basePrice, language)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <div className="flex items-center text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-200'}`}
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

                            <div className="flex flex-col gap-3">
                                {/* Add to Cart */}
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isOutOfStock}
                                    className="w-full h-16 bg-luxury-gold text-luxury-black hover:bg-white hover:text-luxury-black transition-all font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl shadow-luxury-gold/20 flex items-center justify-center gap-2 group border border-white/10"
                                >
                                    <AnimatePresence mode="wait">
                                        {isAdding ? (
                                            <motion.div key="adding" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>{getTranslation('product.adding', language)}</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="idle" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                                                <ShoppingBag className="h-4 w-4" />
                                                <span>{t?.common?.addToCart || 'Add to Cart'}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>

                                {/* Order Now */}
                                <Button
                                    onClick={() => {
                                        addItem({
                                            productId: product.id,
                                            name: product.name,
                                            price: product.salePrice ?? product.basePrice,
                                            image: product.images?.[0]?.url ?? '',
                                            quantity,
                                            stock: product.stock,
                                        });
                                        onClose();
                                        router.push('/checkout');
                                    }}
                                    disabled={isOutOfStock}
                                    className="w-full h-14 bg-black text-white hover:bg-gray-800 transition-all font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-black/10 flex items-center justify-center gap-2 border border-white/10"
                                >
                                    <ArrowRight className="h-4 w-4" />
                                    {t?.common?.orderNow || 'Order Now'}
                                </Button>
                            </div>

                                <Link href={`/products/${product.slug || product.id}`} className="block">
                                    <Button variant="ghost" className="w-full h-14 text-gray-400 hover:text-black uppercase tracking-widest text-[10px] font-black group transition-all">
                                        View Full Details <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
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
            </SheetContent>
        </Sheet>
    );
}
