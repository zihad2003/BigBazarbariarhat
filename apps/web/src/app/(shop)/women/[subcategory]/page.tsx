import { ProductGrid } from '@/components/shop/product-grid';
import { notFound } from 'next/navigation';

// Mock data - In a real app, this would come from an API/Database
const allWomenProducts = [
    { id: '1', name: 'Classic Dress', price: 1899, image: '/products/dress-1.jpg', category: 'women', subcategory: 'dresses' },
    { id: '2', name: 'Elegant Blouse', price: 1299, image: '/products/blouse-1.jpg', category: 'women', subcategory: 'tops' },
    { id: '3', name: 'Premium Top', price: 999, image: '/products/top-1.jpg', category: 'women', subcategory: 'tops' },
    { id: '4', name: 'Essential Tee', price: 799, image: '/products/tee-w-1.jpg', category: 'women', subcategory: 'tops' },
    { id: '5', name: 'Summer Dress', price: 2199, image: '/products/dress-2.jpg', category: 'women', subcategory: 'dresses' },
    { id: '6', name: 'Casual Blouse', price: 1099, image: '/products/blouse-2.jpg', category: 'women', subcategory: 'tops' },
    { id: '7', name: 'Evening Gown', price: 5499, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', category: 'women', subcategory: 'dresses' },
    { id: '8', name: 'Floral Maxi Dress', price: 2899, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop', category: 'women', subcategory: 'dresses' },
    { id: '9', name: 'Silk Scarf', price: 499, image: 'https://images.unsplash.com/photo-1584030373081-f37b785de72d?q=80&w=800&auto=format&fit=crop', category: 'women', subcategory: 'accessories' },
    { id: '10', name: 'Leather Handbag', price: 3499, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop', category: 'women', subcategory: 'accessories' },
    { id: '11', name: 'Denim Jeans', price: 1599, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', category: 'women', subcategory: 'pants' },
    { id: '12', name: 'Pleated Skirt', price: 1299, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop', category: 'women', subcategory: 'skirts' },
];

export default async function WomenSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
    const { subcategory } = await params;

    // Simple normalization for matching
    const normalizedSubcategory = subcategory.toLowerCase();

    // Filter products
    const products = allWomenProducts.filter(p => p.subcategory === normalizedSubcategory);

    // If no products found for this subcategory (and it's not a known empty one), maybe 404?
    // For now, let's just show empty state if nothing found, but usually we'd validate the param.
    // Valid subcategories logic could go here.
    const validSubcategories = ['dresses', 'tops', 'pants', 'skirts', 'sarees', 'accessories'];
    if (!validSubcategories.includes(normalizedSubcategory)) {
        notFound();
    }

    return (
        <>
            {/* Page Header */}
            <section className="py-16 px-6 lg:px-8 bg-gray-50 text-center">
                <h1 className="text-4xl font-bold uppercase mb-4">Women's {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our latest collection of {subcategory}
                </p>
            </section>

            {/* Products */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {products.length > 0 ? (
                        <ProductGrid products={products as any} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No products found in this category yet.</p>
                            <p className="text-gray-400 text-sm mt-2">Check back soon for new arrivals!</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
