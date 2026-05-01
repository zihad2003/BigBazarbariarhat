import { ProductGrid } from '@/components/shop/product-grid';
import { notFound } from 'next/navigation';

// Mock data
const allMenProducts = [
    { id: '1', name: 'Classic Oxford Shirt', price: 1499, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 'shirts' },
    { id: '2', name: 'Casual T-Shirt', price: 599, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 't-shirts' },
    { id: '3', name: 'Slim Fit Chinos', price: 1299, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 'pants' },
    { id: '4', name: 'Denim Jeans', price: 1899, image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 'jeans' },
    { id: '5', name: 'Leather Jacket', price: 8999, image: 'https://images.unsplash.com/photo-1551028919-ac7f5db48e0d?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 'jackets' },
    { id: '6', name: 'Premium Watch', price: 4999, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 'accessories' },
    { id: '7', name: 'Formal Shirt', price: 1599, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 'shirts' },
    { id: '8', name: 'Graphic Tee', price: 699, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 't-shirts' },
    { id: '9', name: 'Winter Coat', price: 3499, image: 'https://images.unsplash.com/photo-1539533018447-63fcce6a25e8?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 'jackets' },
    { id: '10', name: 'Sunglasses', price: 999, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', category: 'men', subcategory: 'accessories' },
];

export default async function MenSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
    const { subcategory } = await params;

    // Simple normalization for matching
    const normalizedSubcategory = subcategory.toLowerCase();

    // Filter products
    const products = allMenProducts.filter(p => p.subcategory === normalizedSubcategory);

    // Valid subcategories should match navigation
    const validSubcategories = ['shirts', 't-shirts', 'pants', 'jeans', 'jackets', 'accessories'];
    if (!validSubcategories.includes(normalizedSubcategory)) {
        notFound();
    }

    return (
        <>
            {/* Page Header */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 text-center">
                <h1 className="text-4xl font-bold uppercase mb-4">Men's {subcategory.replace('-', ' ').charAt(0).toUpperCase() + subcategory.replace('-', ' ').slice(1)}</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Shop our latest collection of men's {subcategory.replace('-', ' ')}
                </p>
            </section>

            {/* Products */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {products.length > 0 ? (
                        <ProductGrid products={products as any} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No products found for {subcategory}.</p>
                            <p className="text-gray-400 text-sm mt-2">More items coming soon!</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
