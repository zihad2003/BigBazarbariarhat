import { ProductGrid } from '@/components/shop/product-grid'

const womenProducts = [
    { id: '1', name: 'Classic Dress', price: 1899, image: '/products/dress-1.jpg', category: 'women' },
    { id: '2', name: 'Elegant Blouse', price: 1299, image: '/products/blouse-1.jpg', category: 'women' },
    { id: '3', name: 'Premium Top', price: 999, image: '/products/top-1.jpg', category: 'women' },
    { id: '4', name: 'Essential Tee', price: 799, image: '/products/tee-w-1.jpg', category: 'women' },
    { id: '5', name: 'Summer Dress', price: 2199, image: '/products/dress-2.jpg', category: 'women' },
    { id: '6', name: 'Casual Blouse', price: 1099, image: '/products/blouse-2.jpg', category: 'women' },
]

export default function WomenPage() {
    return (
        <>
            {/* Page Header */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 text-center">
                <h1 className="text-4xl font-bold uppercase mb-4">Women's Collection</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Elevated essentials for the modern woman
                </p>
            </section>

            {/* Products */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <ProductGrid products={womenProducts} />
                </div>
            </section>
        </>
    )
}
