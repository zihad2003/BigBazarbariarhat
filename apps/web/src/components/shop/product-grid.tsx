import type { Product } from '@/types/product'
import { ProductCard } from './product-card'
import { ProductCardSkeleton } from './product-card-skeleton'
import { cn } from '@/lib/utils'

interface ProductGridProps {
    products: Product[]
    isLoading?: boolean
    viewMode?: 'grid' | 'list'
}

export function ProductGrid({ products, isLoading, viewMode = 'grid' }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className={cn(
                "grid gap-2 md:gap-6 animate-pulse",
                viewMode === 'grid' ? "grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            )}>
                {[...Array(15)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (!products.length) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400 text-sm font-medium">No Product Found</p>
            </div>
        )
    }

    return (
        <div className={cn(
            "grid gap-2 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700",
            viewMode === 'grid' ? "grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    layout={viewMode}
                />
            ))}
        </div>
    )
}
