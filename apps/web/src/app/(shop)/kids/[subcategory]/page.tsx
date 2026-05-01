import { ProductGrid } from '@/components/shop/product-grid';
import { notFound } from 'next/navigation';

// Mock data
const allKidsProducts = [
    { id: '1', name: 'Boys Printed Tee', price: 499, image: 'https://images.unsplash.com/photo-1519238809107-724e7eb888fe?q=80&w=800&auto=format&fit=crop', category: 'kids', subcategory: 'boys' },
    { id: '2', name: 'Girls Summer Dress', price: 799, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop', category: 'kids', subcategory: 'girls' },
    { id: '3', name: 'Infant Romper', price: 399, image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=800&auto=format&fit=crop', category: 'kids', subcategory: 'infants' },
    { id: '4', name: 'Boys Jeans', price: 899, image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop', category: 'kids', subcategory: 'boys' },
    { id: '5', name: 'Girls Leggings', price: 399, image: 'https://images.unsplash.com/photo-1517677208171-0bc6799a4c3d?q=80&w=800&auto=format&fit=crop', category: 'kids', subcategory: 'girls' },
    { id: '6', name: 'Baby Onesie', price: 299, image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop', category: 'kids', subcategory: 'infants' },
    { id: '7', name: 'Kids Jacket', price: 1299, image: 'https://images.unsplash.com/photo-1628149811802-12a86df73836?q=80&w=800&auto=format&fit=crop', category: 'kids', subcategory: 'boys' },
    { id: '8', name: 'Party Frock', price: 1499, image: 'https://images.unsplash.com/photo-1632194554238-6548a313626e?q=80&w=800&auto=format&fit=crop', category: 'kids', subcategory: 'girls' },
];

export default async function KidsSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
    const { subcategory } = await params;

    // Simple normalization for matching
    const normalizedSubcategory = subcategory.toLowerCase();

    // Filter products
    const products = allKidsProducts.filter(p => p.subcategory === normalizedSubcategory);

    // Valid subcategories
    const validSubcategories = ['boys', 'girls', 'infants'];
    if (!validSubcategories.includes(normalizedSubcategory)) {
        notFound();
    }

    return (
        <>
            {/* Page Header */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 text-center">
                <h1 className="text-4xl font-bold uppercase mb-4">Kids: {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Adorable outfits for your little ones
                </p>
            </section>

            {/* Products */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {products.length > 0 ? (
                        <ProductGrid products={products as any} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No products found in this collection.</p>
                            <p className="text-gray-400 text-sm mt-2">Check out other categories!</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
