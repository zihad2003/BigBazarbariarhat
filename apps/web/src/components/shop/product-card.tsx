'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Product, useCartStore } from '@bigbazar/shared'

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)
    // useUIStore might not be in shared yet, check if it's local. 
    // It was local in ProductDetailPage. Let's use local if needed or shared if I moved it.
    // I haven't moved ui-store.ts. So I should remove it from shared import above and import from local.

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem(product, 1) // Default quantity 1, no variant
    }

    const price = product.salePrice || product.basePrice
    const image = product.images?.[0]?.url || '/placeholder.png'

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-xl">
                <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <Button
                    size="icon"
                    className="absolute top-3 right-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 bg-white text-black hover:bg-black hover:text-white rounded-full shadow-lg"
                    onClick={handleAddToCart}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category?.name || 'Big Bazar'}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide group-hover:underline line-clamp-1">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-black">
                        {formatPrice(price)}
                    </p>
                    {product.salePrice && (
                        <p className="text-xs font-medium text-gray-400 line-through">
                            {formatPrice(product.basePrice)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}
