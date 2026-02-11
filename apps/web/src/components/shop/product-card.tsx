'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
    id: string
    name: string
    price: number
    image: string
    category: string
}

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        // TODO: Implement add to cart
        console.log('Add to cart:', id)
    }

    return (
        <Link href={`/product/${id}`} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
                    Big Bazar
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wide group-hover:underline">
                    {name}
                </h3>
                <p className="text-sm font-medium">
                    {formatPrice(price)}
                </p>
            </div>
        </Link>
    )
}
