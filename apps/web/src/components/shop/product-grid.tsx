import { Product } from '@bigbazar/shared'
import { ProductCard } from './product-card'

interface ProductGridProps {
    products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
    if (!products.length) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}
