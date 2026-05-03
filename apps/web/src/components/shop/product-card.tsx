'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductQuickView } from './product-quick-view'
import { formatPrice, cn } from '@/lib/utils'
import type { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/lib/stores/ui-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { DeliveryInfoModal } from './delivery-info-modal'
import { useLanguageStore, useTranslation } from '@bigbazar/shared'

interface ProductCardProps {
    product: Product
    layout?: 'grid' | 'list'
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
    const { language } = useLanguageStore()
    const t = useTranslation()
    const { addItem } = useCartStore()
    const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore()
    const { addNotification } = useUIStore()
    const router = useRouter()
    const [isHovered, setIsHovered] = useState(false)
    const [isAdding, setIsAdding] = useState(false)

    const isOutOfStock = product.stock <= 0
    const secondaryImage = product.images?.[1]?.url
    const price = product.salePrice || product.basePrice
    const discount = product.salePrice
        ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
        : 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isOutOfStock || isAdding) return

        setIsAdding(true)
        // Add artificial delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 500))

        addItem({
            productId: product.id,
            name: product.name,
            price: product.salePrice ?? product.basePrice,
            image: product.images?.[0]?.url ?? '',
            quantity: 1,
            stock: product.stock,
        })
        addNotification({
            type: 'success',
            message: `${product.name} added to cart`
        })
        setIsAdding(false)
        router.push('/cart')
    }

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(product as any)
        const isNowInWishlist = isInWishlist(product.id)
        addNotification({
            type: isNowInWishlist ? 'info' : 'success',
            message: isNowInWishlist ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`
        })
    }

    const image = product.images?.[0]?.url || '/placeholder.png'

    if (layout === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative flex flex-col md:flex-row gap-8 lg:gap-12 bg-white p-6 lg:p-10 rounded-[3rem] border border-gray-100 hover:border-transparent transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]"
            >
                {/* Visual Module */}
                <div className="relative w-full md:w-64 lg:w-80 aspect-[4/5] shrink-0 overflow-hidden bg-gray-50 rounded-[2rem]">
                    <Link href={`/products/${product.slug || product.id}`} className="block h-full">
                        <Image
                            src={image}
                            alt={product.name}
                            fill
                            className={cn(
                                "object-cover transition-all duration-1000",
                                isHovered && secondaryImage ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
                            )}
                            quality={90}
                        />
                        {secondaryImage && (
                            <Image
                                src={secondaryImage}
                                alt={product.name}
                                fill
                                className={cn(
                                    "object-cover absolute inset-0 transition-all duration-1000",
                                    isHovered ? 'scale-105 opacity-100' : 'scale-125 opacity-0'
                                )}
                                quality={90}
                            />
                        )}
                    </Link>

                    {/* Quick Access Actions */}
                    <div className="absolute top-6 right-6 flex flex-col gap-3 z-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                        <button
                            onClick={handleToggleWishlist}
                            className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl",
                                isInWishlist(product.id)
                                    ? 'bg-rose-500 text-white shadow-rose-500/20'
                                    : 'bg-white/90 backdrop-blur-md text-gray-400 hover:text-rose-500 hover:bg-white'
                            )}
                        >
                            <Heart className={cn("h-5 w-5", isInWishlist(product.id) && 'fill-current')} />
                        </button>
                        <ProductQuickView product={product} />
                    </div>
                </div>

                {/* Content Module */}
                <div className="flex-1 flex flex-col py-2">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-lg">
                            {product.category || 'Artifact'}
                        </span>
                        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-lg">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-[10px] font-black text-amber-600">{product.rating || '5.0'}</span>
                        </div>
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-500 tracking-tighter leading-tight">
                        <Link href={`/products/${product.slug || product.id}`}>
                            {product.name}
                        </Link>
                    </h3>

                    <p className="text-gray-500 text-lg font-medium leading-relaxed mb-8 line-clamp-3 lg:line-clamp-none max-w-2xl font-serif italic">
                        {product.description || "Discover the synthesis of craftsmanship and contemporary design. A testament to Big Bazar's commitment to excellence and timeless artifact curation."}
                    </p>

                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center gap-8 lg:gap-12 pt-6 border-t border-gray-50">
                        <div className="flex items-center gap-4">
                            <p className="text-3xl font-black text-gray-900 font-mono tracking-tighter">
                                {formatPrice(price, language)}
                            </p>
                            {product.salePrice && (
                                <p className="text-base font-bold text-gray-300 line-through font-mono">
                                    {formatPrice(product.basePrice, language)}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <Button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || isAdding}
                                className="flex-1 sm:w-64 h-16 bg-black text-white hover:bg-gray-800 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl shadow-black/10 relative overflow-hidden group/btn"
                            >
                                <AnimatePresence mode="wait">
                                    {isAdding ? (
                                        <motion.span key="adding" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                                            Adding...
                                        </motion.span>
                                    ) : (
                                        <motion.span key="idle" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4" />
                                            Add to Cart
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative"
        >
            {/* Visual Module */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-[2.5rem] border border-gray-100 transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:border-transparent">
                <Link href={`/products/${product.slug || product.id}`} className="block w-full h-full relative">
                    {/* Primary Image */}
                    <Image
                        src={image}
                        alt={product.name}
                        fill
                        className={`object-cover transition-all duration-1000 ${isHovered && secondaryImage ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'}`}
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Secondary Image Overlay */}
                    {secondaryImage && (
                        <Image
                            src={secondaryImage}
                            alt={product.name}
                            fill
                            className={`object-cover absolute inset-0 transition-all duration-1000 ${isHovered ? 'scale-105 opacity-100 blur-0' : 'scale-125 opacity-0 blur-md'}`}
                            quality={90}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}
                </Link>

                {/* Badges Overlay */}
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 pointer-events-none">
                    {discount > 0 && (
                        <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl shadow-indigo-500/20">
                            -{discount}%
                        </span>
                    )}
                    {isOutOfStock && (
                        <span className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl">
                            Archived
                        </span>
                    )}
                </div>

                {/* Out of stock overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-[5] flex items-center justify-center p-8 pointer-events-none">
                        <div className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] border border-white/20 shadow-2xl">
                            Out of Stock
                        </div>
                    </div>
                )}

                {/* Quick Access Actions */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 z-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                        onClick={handleToggleWishlist}
                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                        aria-pressed={isInWishlist(product.id)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl ${isInWishlist(product.id)
                            ? 'bg-rose-500 text-white shadow-rose-500/20'
                            : 'bg-white/90 backdrop-blur-md text-gray-400 hover:text-rose-500 hover:bg-white'
                            }`}
                    >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <ProductQuickView product={product} />
                </div>

                {/* Dynamic Action: Add to Cart */}
                <div className={cn(
                    "absolute inset-x-6 bottom-6 z-10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isHovered && !isOutOfStock 
                        ? "translate-y-0 opacity-100 scale-100" 
                        : "translate-y-8 opacity-0 scale-95 pointer-events-none"
                )}>
                    <Button
                        onClick={handleAddToCart}
                        disabled={isAdding || isOutOfStock}
                        className="w-full h-14 bg-luxury-gold text-luxury-black hover:bg-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-[0_20px_40px_-10px_rgba(212,175,55,0.4)] flex items-center justify-center gap-3 border border-white/10 transition-all duration-500 hover:-translate-y-1"
                    >
                        <AnimatePresence mode="wait">
                            {isAdding ? (
                                <motion.div
                                    key="adding"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="h-3 w-3 border-2 border-luxury-black/30 border-t-luxury-black rounded-full animate-spin" />
                                    <span>{language === 'bn' ? 'যোগ করা হচ্ছে...' : 'Adding...'}</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -10, opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    <span>{t?.common?.addToCart || (language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart')}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </div>
            </div>

            {/* Information Module */}
            <div className="mt-8 px-2 space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        {product.category || 'Big Bazar'}
                    </span>
                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-black text-gray-900">{product.rating || '5.0'}</span>
                    </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors duration-500 line-clamp-2 leading-snug tracking-tight min-h-[3rem]">
                    <Link href={`/products/${product.slug || product.id}`}>
                        {product.name}
                    </Link>
                </h3>

                <div className="flex items-center gap-4 pt-3">
                    <p className="text-2xl font-black text-gray-900 font-mono tracking-tighter">
                        {formatPrice(price, language)}
                    </p>
                    {product.salePrice && (
                        <p className="text-sm font-bold text-gray-300 line-through font-mono">
                            {formatPrice(product.basePrice, language)}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
