import { ProductGrid } from '@/components/shop/product-grid'

const kidsProducts = [
    { id: '1', name: 'Kids Tee', price: 699, image: '/products/kids-tee-1.jpg', category: 'kids' },
    { id: '2', name: 'Junior Polo', price: 899, image: '/products/kids-polo-1.jpg', category: 'kids' },
    { id: '3', name: 'Kids Dress', price: 1099, image: '/products/kids-dress-1.jpg', category: 'kids' },
    { id: '4', name: 'Casual Shirt', price: 799, image: '/products/kids-shirt-1.jpg', category: 'kids' },
]

export default function KidsPage() {
    return (
        <>
            {/* Page Header */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 text-center">
                <h1 className="text-4xl font-bold uppercase mb-4">Kids Collection</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Premium quality clothing for little ones
                </p>
            </section>

            {/* Products */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <ProductGrid products={kidsProducts as any} />
                </div>
            </section>
        </>
    )
}
