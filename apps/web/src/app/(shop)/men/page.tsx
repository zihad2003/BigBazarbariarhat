import { ProductGrid } from '@/components/shop/product-grid'

const menProducts = [
    { id: '1', name: 'Classic Polo Shirt', price: 999, image: '/products/polo-1.jpg', category: 'men' },
    { id: '2', name: 'Essential Tee', price: 799, image: '/products/tee-1.jpg', category: 'men' },
    { id: '3', name: 'Signature Polo', price: 1299, image: '/products/polo-2.jpg', category: 'men' },
    { id: '4', name: 'Premium Shirt', price: 1499, image: '/products/shirt-1.jpg', category: 'men' },
    { id: '5', name: 'Casual Tee', price: 699, image: '/products/tee-2.jpg', category: 'men' },
    { id: '6', name: 'Sport Polo', price: 1199, image: '/products/polo-3.jpg', category: 'men' },
    { id: '7', name: 'V-Neck Tee', price: 899, image: '/products/tee-3.jpg', category: 'men' },
    { id: '8', name: 'Henley Shirt', price: 1099, image: '/products/shirt-2.jpg', category: 'men' },
]

export default function MenPage() {
    return (
        <>
            {/* Page Header */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 text-center">
                <h1 className="text-4xl font-bold uppercase mb-4">Men's Essentials</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Premium basics designed for the modern man
                </p>
            </section>

            {/* Products */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <ProductGrid products={menProducts} />
                </div>
            </section>
        </>
    )
}
