import { redirect } from 'next/navigation';

export default async function WomenSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
    const { subcategory } = await params;
    redirect(`/products?category=women&subcategory=women-${encodeURIComponent(subcategory.toLowerCase())}`);
}
