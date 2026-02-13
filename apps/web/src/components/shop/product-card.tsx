'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Heart, ShoppingBag, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Product, useCartStore } from '@bigbazar/shared'
import { useState } from 'react'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)
    const [isHovered, setIsHovered] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(product, 1)
    }

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsWishlisted(!isWishlisted)
    }

    const price = product.salePrice || product.basePrice
    const image = product.images?.[0]?.url || '/placeholder.png'

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group block card-luxury-hover"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-luxury-black-lighter mb-4 border border-luxury-black-lighter rounded-sm group-hover:border-luxury-gold/50 transition-all duration-500">
                <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover img-luxury-zoom"
                    quality={90}
                />

                {/* Luxury badge overlay */}
                {product.salePrice && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="badge-luxury badge-luxury-red">
                            Sale
                        </span>
                    </div>
                )}

                {/* Quick actions overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    <button
                        onClick={handleToggleWishlist}
                        className={`p-2.5 rounded-sm transition-all duration-300 ${
                            isWishlisted
                                ? 'bg-luxury-red text-white shadow-luxury-gold'
                                : 'bg-white/90 backdrop-blur-sm text-luxury-black hover:bg-luxury-red hover:text-white'
                        }`}
                    >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <Button
                        size="icon"
                        className="opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 bg-luxury-gold text-luxury-black hover:bg-white rounded-sm shadow-luxury-gold btn-luxury-glow"
                        onClick={handleAddToCart}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Add to cart overlay on hover */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-luxury-black/95 via-luxury-black/80 to-transparent transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                    <Button className="w-full gap-2 bg-luxury-gold text-luxury-black hover:bg-white font-bold uppercase tracking-widest text-xs rounded-sm shadow-luxury-gold btn-luxury-glow">
                        <ShoppingBag className="h-3 w-3" />
                        Add to Cart
                    </Button>
                </div>

                {/* Gold border glow effect */}
                <div className="absolute inset-0 border-2 border-luxury-gold/0 group-hover:border-luxury-gold/30 transition-all duration-500 pointer-events-none rounded-sm" />
            </div>

            <div className="space-y-1.5">
                {/* Category */}
                <span className="text-xs text-luxury-gold/70 uppercase tracking-widest font-lato">
                    {product.category?.name || 'Big Bazar'}
                </span>

                {/* Product Name */}
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-playfair group-hover:text-luxury-gold transition-colors duration-300 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-3 w-3 ${i < 4 ? 'fill-luxury-gold text-luxury-gold' : 'text-gray-600'}`}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-500">(4.0)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2.5 pt-1">
                    <p className="text-base font-bold text-luxury-gold font-playfair">
                        {formatPrice(price)}
                    </p>
                    {product.salePrice && (
                        <p className="text-xs font-medium text-gray-500 line-through decoration-luxury-red">
                            {formatPrice(product.basePrice)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}
