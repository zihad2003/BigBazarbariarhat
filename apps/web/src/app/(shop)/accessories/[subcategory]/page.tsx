import { ProductGrid } from '@/components/shop/product-grid';
import { notFound } from 'next/navigation';

// Mock data (same as accessories/page.tsx)
const allAccessoriesProducts = [
    { id: '1', name: 'Leather Satchel', price: 3499, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop', category: 'accessories', subcategory: 'bags' },
    { id: '2', name: 'Minimalist Watch', price: 4999, image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=800&auto=format&fit=crop', category: 'accessories', subcategory: 'watches' },
    { id: '3', name: 'Gold Necklace', price: 7999, image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop', category: 'accessories', subcategory: 'jewelry' },
    { id: '4', name: 'Aviator Sunglasses', price: 1599, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop', category: 'accessories', subcategory: 'sunglasses' },
    { id: '5', name: 'Canvas Backpack', price: 2199, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', category: 'accessories', subcategory: 'bags' },
    { id: '6', name: 'Silver Bracelet', price: 1299, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop', category: 'accessories', subcategory: 'jewelry' },
    { id: '7', name: 'Sport Watch', price: 2999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', category: 'accessories', subcategory: 'watches' },
    { id: '8', name: 'Cat Eye Sunglasses', price: 1299, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', category: 'accessories', subcategory: 'sunglasses' },
];

export default async function AccessoriesSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
    const { subcategory } = await params;

    // Simple normalization for matching
    const normalizedSubcategory = subcategory.toLowerCase();

    // Filter products
    const products = allAccessoriesProducts.filter(p => p.subcategory === normalizedSubcategory);

    // Valid subcategories
    const validSubcategories = ['bags', 'watches', 'jewelry', 'sunglasses'];
    if (!validSubcategories.includes(normalizedSubcategory)) {
        notFound();
    }

    return (
        <>
            {/* Page Header */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 text-center">
                <h1 className="text-4xl font-bold uppercase mb-4">{subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Premium {subcategory} for your collection
                </p>
            </section>

            {/* Products */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {products.length > 0 ? (
                        <ProductGrid products={products as any} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No products found in this category.</p>
                            <p className="text-gray-400 text-sm mt-2">Check out other accessories!</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
