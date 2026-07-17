'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { formatPrice, cn } from '@/lib/utils'
import type { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import { useUIStore } from '@/lib/stores/ui-store'
import { useWishlistStore } from '@/store/wishlistStore'
import { DeliveryInfoModal } from './delivery-info-modal'
import { useLanguageStore, useTranslation } from '@bigbazar/shared'
import { t as getTranslation } from '@/lib/i18n/translations'

const ProductQuickView = dynamic(() => import('./product-quick-view').then(mod => mod.ProductQuickView), {
    ssr: false
})

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
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

    const isOutOfStock = product.stock <= 0
    const secondImage = product.images?.[1]
    const secondaryImage = typeof secondImage === 'string' ? secondImage : (secondImage && typeof secondImage === 'object' && 'url' in secondImage ? (secondImage as any).url : undefined)
    const price = product.salePrice || product.basePrice
    const discount = product.salePrice
        ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
        : 0;

    const handleOrderNow = async (e: React.MouseEvent) => {
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
            image: typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url ?? '/placeholder.png'),
            quantity: 1,
            stock: product.stock,
        })
        setIsAdding(false)
        router.push('/checkout')
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

    const firstImage = product.images?.[0]
    const image = typeof firstImage === 'string' ? firstImage : (firstImage && typeof firstImage === 'object' && 'url' in firstImage ? (firstImage as any).url : '')
    const hasImage = !!image && image !== '/placeholder.png'

    if (layout === 'list') {
        return (
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative flex flex-col md:flex-row gap-6 lg:gap-8 bg-white p-5 lg:p-6 rounded-2xl border border-gray-100 hover:border-transparent transition-all duration-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]"
            >
                {/* Visual Module */}
                <div className="relative w-full md:w-48 lg:w-60 aspect-[4/5] shrink-0 overflow-hidden bg-gray-50 rounded-xl">
                    <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 block">
                        {hasImage ? (
                            <Image
                                src={image}
                                alt={product.name}
                                fill
                                className={cn(
                                    "object-cover transition-all duration-1000",
                                    isHovered && secondaryImage ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
                                )}
                                quality={90}
                                sizes="(max-width: 768px) 100vw, 240px"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100/70">
                                <div className="w-10 h-10 rounded-xl bg-neutral-200/40 flex items-center justify-center mb-2">
                                    <ShoppingBag className="h-4.5 w-4.5 text-neutral-400" />
                                </div>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">No Image</span>
                            </div>
                        )}
                        {hasImage && secondaryImage && (
                            <Image
                                src={secondaryImage}
                                alt={product.name}
                                fill
                                className={cn(
                                    "object-cover absolute inset-0 transition-all duration-1000",
                                    isHovered ? 'scale-105 opacity-100' : 'scale-125 opacity-0'
                                )}
                                quality={90}
                                sizes="(max-width: 768px) 100vw, 240px"
                            />
                        )}
                    </Link>

                    {/* Quick Access Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-550">
                        <button
                            onClick={handleToggleWishlist}
                            className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md",
                                isInWishlist(product.id)
                                    ? 'bg-rose-500 text-white shadow-rose-500/10'
                                    : 'bg-white/90 backdrop-blur-sm text-gray-450 hover:text-rose-500 hover:bg-white'
                            )}
                        >
                            <Heart className={cn("h-4.5 w-4.5", isInWishlist(product.id) && 'fill-current')} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsQuickViewOpen(true);
                            }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/90 backdrop-blur-sm text-gray-455 hover:text-black hover:bg-white transition-all duration-300 shadow-md"
                            aria-label="Quick view"
                        >
                            <Plus className="h-4.5 w-4.5" />
                        </button>
                        {isQuickViewOpen && (
                            <ProductQuickView
                                product={product}
                                isOpen={isQuickViewOpen}
                                onClose={() => setIsQuickViewOpen(false)}
                            />
                        )}
                    </div>
                </div>

                {/* Content Module */}
                <div className="flex-1 flex flex-col py-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">
                            {typeof product.category === 'object' ? (product.category as any)?.name : (product.category || 'Collection')}
                        </span>
                        <div className="flex items-center gap-1.0 bg-amber-50 px-2 py-0.5 rounded-md">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-[9px] font-bold text-amber-600">{product.rating || '5.0'}</span>
                        </div>
                    </div>

                    <h3 className="text-xl lg:text-2xl font-bold text-neutral-905 mb-2 group-hover:text-emerald-600 transition-colors duration-400 tracking-tight">
                        <Link href={`/products/${product.slug || product.id}`}>
                            {product.name}
                        </Link>
                    </h3>

                    <p className="text-neutral-500 text-sm leading-relaxed mb-4 max-w-xl line-clamp-3">
                        {product.description || "Discover the synthesis of craftsmanship and contemporary design. A testament to Big Bazar's commitment to excellence and timeless curation."}
                    </p>

                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <p className="text-xl font-bold text-neutral-950 font-mono tracking-tight">
                                {formatPrice(price, language)}
                            </p>
                            {product.salePrice && (
                                <p className="text-xs font-semibold text-neutral-350 line-through font-mono">
                                    {formatPrice(product.basePrice, language)}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
                            <Button
                                onClick={handleOrderNow}
                                disabled={isOutOfStock || isAdding}
                                className="flex-1 sm:w-48 h-10 bg-neutral-950 hover:bg-neutral-850 text-white font-bold uppercase tracking-wider text-[9px] rounded-xl shadow-lg transition-all duration-300"
                            >
                                {isAdding ? (
                                    <span>{getTranslation('product.ordering', language)}</span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <ArrowRight className="h-3.5 w-3.5 mr-1" />
                                        Buy Now
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative"
        >
            {/* Visual Module */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 transition-all duration-700 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:border-transparent">
                <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 block">
                    {/* Primary Image */}
                    {hasImage ? (
                        <Image
                            src={image}
                            alt={product.name}
                            fill
                            className={cn(
                                "object-cover transition-all duration-700",
                                isHovered && secondaryImage ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
                            )}
                            quality={90}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100/70">
                            <div className="w-10 h-10 rounded-xl bg-neutral-200/40 flex items-center justify-center mb-2">
                                <ShoppingBag className="h-4.5 w-4.5 text-neutral-400" />
                            </div>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">No Image</span>
                        </div>
                    )}

                    {/* Secondary Image Overlay */}
                    {hasImage && secondaryImage && (
                        <Image
                            src={secondaryImage}
                            alt={product.name}
                            fill
                            className={cn(
                                "object-cover absolute inset-0 transition-all duration-700",
                                isHovered ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                            )}
                            quality={90}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    )}
                </Link>

                {/* Badges Overlay */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1 pointer-events-none">
                    {discount > 0 && (
                        <span className="bg-emerald-600 text-white text-[7px] md:text-[8px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                            -{discount}%
                        </span>
                    )}
                    {isOutOfStock && (
                        <span className="bg-neutral-900 text-white text-[7px] md:text-[8px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                            Archived
                        </span>
                    )}
                </div>

                {/* Out of stock overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[5] flex items-center justify-center p-4 pointer-events-none">
                        <div className="bg-neutral-950 text-white px-3 py-1.5 text-[8px] md:text-[9px] font-bold uppercase tracking-wider rounded-md shadow-md">
                            Out of Stock
                        </div>
                    </div>
                )}

                {/* Quick Access Actions */}
                <div className={cn(
                    "absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-1.5 z-10 transition-all duration-500",
                    isInWishlist(product.id)
                        ? "translate-x-0 opacity-100"
                        : "translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                )}>
                    <button
                        onClick={handleToggleWishlist}
                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                        aria-pressed={isInWishlist(product.id)}
                        className={cn(
                            "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md",
                            isInWishlist(product.id)
                                ? 'bg-rose-500 text-white shadow-rose-500/10'
                                : 'bg-white/95 backdrop-blur-sm text-gray-400 hover:text-rose-500 hover:bg-white'
                        )}
                    >
                        <Heart className={cn("h-4 w-4 md:h-4.5 md:w-4.5", isInWishlist(product.id) && 'fill-current')} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsQuickViewOpen(true);
                        }}
                        aria-label="Quick view"
                        className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center bg-white/95 backdrop-blur-sm text-gray-450 hover:text-black hover:bg-white transition-all duration-300 shadow-md"
                    >
                        <Plus className="h-4 w-4 md:h-4.5 md:w-4.5" />
                    </button>
                </div>

                {/* Dynamic Action: Cart & Checkout (Desktop hover only) */}
                <div className={cn(
                    "hidden md:flex absolute inset-x-3 bottom-3 z-10 gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isHovered && !isOutOfStock 
                        ? "translate-y-0 opacity-100" 
                        : "translate-y-3 opacity-0 pointer-events-none"
                )}>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem({
                                productId: product.id,
                                name: product.name,
                                price: product.salePrice ?? product.basePrice,
                                image: typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url ?? '/placeholder.png'),
                                quantity: 1,
                                stock: product.stock,
                            });
                            addNotification({
                                type: 'success',
                                message: `${product.name} ${getTranslation('product.addedToCart', language)}`
                            });
                        }}
                        className="flex-1 h-9 bg-white/95 backdrop-blur text-neutral-900 hover:bg-black hover:text-white font-bold uppercase tracking-wider text-[8px] rounded-xl shadow-lg border border-neutral-100 transition-all duration-300"
                    >
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        <span>Add</span>
                    </Button>

                    <Button
                        onClick={handleOrderNow}
                        disabled={isAdding}
                        className="flex-1 h-9 bg-emerald-600/95 backdrop-blur text-white hover:bg-emerald-700 font-bold uppercase tracking-wider text-[8px] rounded-xl shadow-lg transition-all duration-300"
                    >
                        {isAdding ? (
                            <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                            <div className="flex items-center gap-1 justify-center">
                                <ArrowRight className="h-3 w-3" />
                                <span>Buy</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>

            {/* Information Module */}
            <div className="mt-2.5 md:mt-3.5 px-0.5 space-y-1">
                <div className="flex items-center justify-between text-[9px] md:text-[10px] font-bold text-neutral-450 uppercase tracking-wider">
                    <span>
                        {typeof product.category === 'object' ? (product.category as any)?.name : (product.category || 'Big Bazar')}
                    </span>
                    <div className="flex items-center gap-0.5 font-bold text-neutral-800">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating || '5.0'}</span>
                    </div>
                </div>

                <h3 className="text-xs md:text-sm font-semibold text-neutral-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 leading-tight tracking-tight min-h-[2rem] md:min-h-[2.5rem]">
                    <Link href={`/products/${product.slug || product.id}`}>
                        {product.name}
                    </Link>
                </h3>

                <div className="flex items-baseline gap-1.5 pt-0.5">
                    <p className="text-[11px] md:text-base font-bold text-neutral-950 font-mono tracking-tight">
                        {formatPrice(price, language)}
                    </p>
                    {product.salePrice && (
                        <p className="text-[9px] md:text-xs font-semibold text-neutral-350 line-through font-mono">
                            {formatPrice(product.basePrice, language)}
                        </p>
                    )}
                </div>
            </div>

            {/* Stable actions for mobile */}
            {!isOutOfStock && (
                <div className="flex md:hidden gap-1.5 mt-2.5 px-0.5">
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem({
                                productId: product.id,
                                name: product.name,
                                price: product.salePrice ?? product.basePrice,
                                image: typeof product.images?.[0] === 'string' ? product.images[0] : (product.images?.[0]?.url ?? '/placeholder.png'),
                                quantity: 1,
                                stock: product.stock,
                            });
                            addNotification({
                                type: 'success',
                                message: `${product.name} ${getTranslation('product.addedToCart', language)}`
                            });
                        }}
                        className="flex-1 h-7.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold uppercase tracking-wider text-[8px] rounded-lg shadow-sm flex items-center justify-center gap-1"
                    >
                        <ShoppingBag className="h-2.5 w-2.5" />
                        <span>Add</span>
                    </Button>

                    <Button
                        onClick={handleOrderNow}
                        className="flex-1 h-7.5 bg-emerald-600 text-white hover:bg-emerald-700 font-bold uppercase tracking-wider text-[8px] rounded-lg shadow-sm flex items-center justify-center gap-1"
                    >
                        <ArrowRight className="h-2.5 w-2.5" />
                        <span>Buy</span>
                    </Button>
                </div>
            )}
            {isQuickViewOpen && (
                <ProductQuickView
                    product={product}
                    isOpen={isQuickViewOpen}
                    onClose={() => setIsQuickViewOpen(false)}
                />
            )}
        </div>
    )
}
