import { redirect } from 'next/navigation';

export default async function MenSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
    const { subcategory } = await params;
    redirect(`/products?category=men&subcategory=men-${encodeURIComponent(subcategory.toLowerCase())}`);
}
